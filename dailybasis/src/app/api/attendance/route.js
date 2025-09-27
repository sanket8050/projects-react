import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const form = await request.formData();
    const userId = parseInt(form.get('userId'));
    // defend against missing/invalid inputs
    const attendingRaw = form.get('attending');
    const attending = attendingRaw === 'true' || attendingRaw === true;

    // log inputs for debugging
    // eslint-disable-next-line no-console
    console.log('[attendance] POST userId=', userId, 'attendingRaw=', attendingRaw, 'attending=', attending);

    if (Number.isNaN(userId)) {
      return new Response(JSON.stringify({ ok: false, error: 'invalid userId' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // snapshot before
    const before = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, attending: true, isRegular: true, lastUpdate: true } });

    const updated = await prisma.user.update({ where: { id: userId }, data: { attending, lastUpdate: new Date() }, select: { id: true, attending: true, isRegular: true, lastUpdate: true } });

    // eslint-disable-next-line no-console
    console.log('[attendance] before=', before, 'after=', updated);

    return new Response(JSON.stringify({ ok: true, before, after: updated }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('attendance API error', err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function GET() {
  // Some Next.js internals or RSC prefetching may issue GET requests to
  // app routes (with _rsc query). Return a small JSON response so they
  // don't receive a 405 Method Not Allowed.
  return new Response(JSON.stringify({ ok: true, message: 'GET received; use POST to update attendance' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
