import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';

@Controller('invoices')
export class InvoiceController {
  constructor(private prisma: PrismaService) {}

  @Get()
  findAll() {
    return this.prisma.invoice.findMany();
  }

  @Post()
  async create(@Body() data: any) {
    const invoice = await this.prisma.invoice.create({ data });

    // Otomatis buat jurnal penjualan
    // Cari akun Piutang Usaha, Pendapatan, PPN Keluaran
    const piutang = await this.prisma.account.findFirst({ where: { name: { contains: 'Piutang' } } });
    const pendapatan = await this.prisma.account.findFirst({ where: { type: 'INCOME' } });
    const ppn = await this.prisma.account.findFirst({ where: { name: { contains: 'PPN Keluaran' } } });

    if (piutang && pendapatan) {
      const entries = [
        { accountId: piutang.id, debit: invoice.amount, credit: 0 },
        { accountId: pendapatan.id, debit: 0, credit: invoice.amount * 0.89 }, // 89% ke pendapatan
      ];
      if (ppn) {
        entries.push({ accountId: ppn.id, debit: 0, credit: invoice.amount * 0.11 }); // 11% ke PPN
      }

      await this.prisma.journal.create({
        data: {
          date: invoice.createdAt,
          description: `Penjualan Invoice #${invoice.id}`,
          total: invoice.amount,
          entries: { create: entries },
        },
      });
    }

    return invoice;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.prisma.invoice.update({ where: { id: Number(id) }, data });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.prisma.invoice.delete({ where: { id: Number(id) } });
  }

  @Patch(':id/cancel')
  async cancel(@Param('id') id: string) {
    // Update status invoice ke BATAL
    const invoice = await this.prisma.invoice.update({
      where: { id: Number(id) },
      data: { status: 'BATAL' },
    });

    // Cari jurnal penjualan terkait (by description atau tanggal)
    const journal = await this.prisma.journal.findFirst({
      where: {
        description: { contains: `Invoice #${invoice.id}` },
        date: invoice.createdAt,
      },
      include: { entries: true },
    });

    if (journal) {
      // Buat jurnal reversal (balik debit/kredit)
      const reversalEntries = journal.entries.map(e => ({
        accountId: e.accountId,
        debit: e.credit,
        credit: e.debit,
      }));

      await this.prisma.journal.create({
        data: {
          date: new Date(),
          description: `Reversal Invoice #${invoice.id}`,
          total: invoice.amount,
          entries: { create: reversalEntries },
        },
      });
    }

    return { message: 'Invoice dibatalkan & jurnal reversal dibuat', invoice };
  }

  @Post(':id/payment-link')
  async createPaymentLink(@Param('id') id: string) {
    const invoice = await this.prisma.invoice.findUnique({ where: { id: Number(id) } });
    if (!invoice) {
      throw new Error('Invoice not found');
    }
    
    const midtransServerKey = process.env.MIDTRANS_SERVER_KEY; // simpan di .env
    const auth = Buffer.from(midtransServerKey + ':').toString('base64');

    const response = await axios.post(
      'https://api.sandbox.midtrans.com/v1/payment-links',
      {
        transaction_details: {
          order_id: `INV-${invoice.id}`,
          gross_amount: invoice.amount,
        },
        customer_details: {
          first_name: invoice.studentName,
          email: 'student@example.com', // Default email karena tidak ada field email di schema baru
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${auth}`,
        },
      }
    );
    
    // Note: paymentLink field tidak ada di schema baru, jadi kita skip update
    return { payment_url: response.data.payment_url };
  }
}