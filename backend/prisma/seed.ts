import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  await prisma.auditLog.deleteMany();
  await prisma.rolePermission.deleteMany();
  await prisma.creditTransaction.deleteMany();
  await prisma.studentCredit.deleteMany();
  await prisma.creditPackage.deleteMany();
  await prisma.journalEntry.deleteMany();
  await prisma.journal.deleteMany();
  await prisma.account.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.kelas.deleteMany();
  await prisma.user.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.role.deleteMany();
  await prisma.conversationType.deleteMany();
  await prisma.settings.deleteMany();

  console.log('🧹 Database cleared successfully!');

  // Create default permissions
  console.log('🔐 Creating default permissions...');
  
  const permissions = await Promise.all([
    // User permissions
    prisma.permission.create({ data: { name: 'user.create', displayName: 'Create User', module: 'user', description: 'Can create new users' } }),
    prisma.permission.create({ data: { name: 'user.read', displayName: 'Read User', module: 'user', description: 'Can view user information' } }),
    prisma.permission.create({ data: { name: 'user.update', displayName: 'Update User', module: 'user', description: 'Can update user information' } }),
    prisma.permission.create({ data: { name: 'user.delete', displayName: 'Delete User', module: 'user', description: 'Can delete users' } }),
    
    // Role permissions
    prisma.permission.create({ data: { name: 'role.create', displayName: 'Create Role', module: 'role', description: 'Can create new roles' } }),
    prisma.permission.create({ data: { name: 'role.read', displayName: 'Read Role', module: 'role', description: 'Can view role information' } }),
    prisma.permission.create({ data: { name: 'role.update', displayName: 'Update Role', module: 'role', description: 'Can update role information' } }),
    prisma.permission.create({ data: { name: 'role.delete', displayName: 'Delete Role', module: 'role', description: 'Can delete roles' } }),
    
    // Finance permissions
    prisma.permission.create({ data: { name: 'finance.create', displayName: 'Create Finance', module: 'finance', description: 'Can create financial records' } }),
    prisma.permission.create({ data: { name: 'finance.read', displayName: 'Read Finance', module: 'finance', description: 'Can view financial information' } }),
    prisma.permission.create({ data: { name: 'finance.update', displayName: 'Update Finance', module: 'finance', description: 'Can update financial records' } }),
    prisma.permission.create({ data: { name: 'finance.delete', displayName: 'Delete Finance', module: 'finance', description: 'Can delete financial records' } }),
    
    // Academic permissions
    prisma.permission.create({ data: { name: 'academic.create', displayName: 'Create Academic', module: 'academic', description: 'Can create academic records' } }),
    prisma.permission.create({ data: { name: 'academic.read', displayName: 'Read Academic', module: 'academic', description: 'Can view academic information' } }),
    prisma.permission.create({ data: { name: 'academic.update', displayName: 'Update Academic', module: 'academic', description: 'Can update academic records' } }),
    prisma.permission.create({ data: { name: 'academic.delete', displayName: 'Delete Academic', module: 'academic', description: 'Can delete academic records' } }),
    
    // System permissions
    prisma.permission.create({ data: { name: 'system.settings', displayName: 'System Settings', module: 'system', description: 'Can manage system settings' } }),
    prisma.permission.create({ data: { name: 'system.admin', displayName: 'System Admin', module: 'system', description: 'Full system administration access' } }),
  ]);

  // Create default roles
  console.log('👥 Creating default roles...');
  
  const roles = await Promise.all([
    prisma.role.create({ 
      data: { 
        name: 'ADMIN', 
        displayName: 'Administrator', 
        description: 'Full system access',
        isSystem: true
      } 
    }),
    prisma.role.create({ 
      data: { 
        name: 'GURU', 
        displayName: 'Guru', 
        description: 'Teacher access',
        isSystem: true
      } 
    }),
    prisma.role.create({ 
      data: { 
        name: 'SISWA', 
        displayName: 'Siswa', 
        description: 'Student access',
        isSystem: true
      } 
    }),
    prisma.role.create({ 
      data: { 
        name: 'FINANCE', 
        displayName: 'Finance', 
        description: 'Finance department access',
        isSystem: true
      } 
    }),
    prisma.role.create({ 
      data: { 
        name: 'SSC', 
        displayName: 'SSC Staff', 
        description: 'SSC staff access',
        isSystem: true
      } 
    }),
    prisma.role.create({ 
      data: { 
        name: 'SEA', 
        displayName: 'SEA Staff', 
        description: 'SEA staff access',
        isSystem: true
      } 
    }),
  ]);

  // Assign permissions to roles
  console.log('🔗 Assigning permissions to roles...');
  
  const adminRole = roles.find(r => r.name === 'ADMIN');
  const guruRole = roles.find(r => r.name === 'GURU');
  const siswaRole = roles.find(r => r.name === 'SISWA');
  const financeRole = roles.find(r => r.name === 'FINANCE');

  if (!adminRole || !guruRole || !siswaRole || !financeRole) {
    throw new Error('Required roles not found');
  }

  // Admin gets all permissions
  const adminPermissions = permissions.map(p => ({
    roleId: adminRole.id,
    permissionId: p.id
  }));

  // Guru gets academic and user read permissions
  const guruPermissions = permissions
    .filter(p => p.module === 'academic' || (p.module === 'user' && p.name.includes('read')))
    .map(p => ({
      roleId: guruRole.id,
      permissionId: p.id
    }));

  // Siswa gets limited permissions
  const siswaPermissions = permissions
    .filter(p => p.name === 'academic.read' || p.name === 'user.read')
    .map(p => ({
      roleId: siswaRole.id,
      permissionId: p.id
    }));

  // Finance gets finance permissions
  const financePermissions = permissions
    .filter(p => p.module === 'finance')
    .map(p => ({
      roleId: financeRole.id,
      permissionId: p.id
    }));

  await prisma.rolePermission.createMany({
    data: [...adminPermissions, ...guruPermissions, ...siswaPermissions, ...financePermissions]
  });

  // Create default conversation types
  console.log('💬 Creating default conversation types...');
  
  await Promise.all([
    prisma.conversationType.create({
      data: {
        name: 'private',
        displayName: 'Private Chat',
        description: 'One-on-one private conversation',
        isSystem: true,
        maxParticipants: 2,
        allowFileUpload: true,
        allowEditMessage: true,
        allowDeleteMessage: true
      }
    }),
    prisma.conversationType.create({
      data: {
        name: 'group',
        displayName: 'Group Chat',
        description: 'Group conversation with multiple participants',
        isSystem: true,
        maxParticipants: 50,
        allowFileUpload: true,
        allowEditMessage: true,
        allowDeleteMessage: true
      }
    }),
    prisma.conversationType.create({
      data: {
        name: 'announcement',
        displayName: 'Announcement',
        description: 'Announcement channel for important messages',
        isSystem: true,
        maxParticipants: null,
        allowFileUpload: false,
        allowEditMessage: false,
        allowDeleteMessage: false
      }
    }),
    prisma.conversationType.create({
      data: {
        name: 'support',
        displayName: 'Support Chat',
        description: 'Support conversation for help and assistance',
        isSystem: true,
        maxParticipants: 10,
        allowFileUpload: true,
        allowEditMessage: false,
        allowDeleteMessage: false
      }
    })
  ]);

  // Create default settings
  console.log('⚙️ Creating default settings...');
  
  const defaultSettings = [
    { key: 'school_name', value: 'Jakarta Mandarin', category: 'general', description: 'Nama sekolah' },
    { key: 'school_address', value: 'Jl Ratu Kemuning D11 No. 26B, RT.9/RW.13, Duri Kepa, Kec. Kb. Jeruk, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta 11510', category: 'general', description: 'Alamat sekolah' },
    { key: 'school_phone', value: '+62 21 1234 5678', category: 'general', description: 'Telepon sekolah' },
    { key: 'school_email', value: 'info@jakartamandarin.com', category: 'general', description: 'Email sekolah' },
    { key: 'school_website', value: 'https://jakartamandarin.com', category: 'general', description: 'Website sekolah' },
    { key: 'timezone', value: 'Asia/Jakarta', category: 'general', description: 'Zona waktu default' },
    { key: 'language', value: 'id', category: 'general', description: 'Bahasa default' },
    { key: 'smtp_host', value: 'smtp.gmail.com', category: 'email', description: 'SMTP host untuk email' },
    { key: 'smtp_port', value: '587', category: 'email', description: 'SMTP port' },
    { key: 'sender_email', value: 'noreply@jakartamandarin.com', category: 'email', description: 'Email pengirim' },
    { key: 'email_notifications', value: 'true', category: 'notifications', description: 'Aktifkan notifikasi email' },
    { key: 'whatsapp_notifications', value: 'false', category: 'notifications', description: 'Aktifkan notifikasi WhatsApp' },
    { key: 'min_password_length', value: '8', category: 'security', description: 'Panjang minimum password' },
    { key: 'session_timeout', value: '30', category: 'security', description: 'Timeout session dalam menit' }
  ];

  for (const setting of defaultSettings) {
    await prisma.settings.upsert({
      where: { key: setting.key },
      update: setting,
      create: setting
    });
  }

  console.log('✅ Database seeding completed successfully!');
  console.log(`📊 Created ${permissions.length} permissions`);
  console.log(`👥 Created ${roles.length} roles`);
  console.log(`💬 Created 4 conversation types`);
  console.log(`⚙️ Created ${defaultSettings.length} settings`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 