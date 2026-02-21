import { NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/seed';

export async function GET() {
    try {
        await seedDatabase();
        return NextResponse.json({ message: 'Database seeded successfully!' }, { status: 200 });
    } catch (error: any) {
        console.error('Error seeding database:', error);
        return NextResponse.json({
            error: 'Failed to seed database',
            details: error.message
        }, { status: 500 });
    }
}
