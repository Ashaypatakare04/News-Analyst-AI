import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/articles/[id]/route';
import { adminDb } from '@/lib/firebase-admin';

vi.mock('@/lib/firebase-admin', () => ({
  adminDb: {
    collection: vi.fn(() => ({
      doc: vi.fn(() => ({
        get: vi.fn(),
      })),
    })),
  },
}));

describe('API: /api/articles/[id]', () => {
  it('should return 404 if article does not exist', async () => {
    const mockGet = vi.fn(() => Promise.resolve({ exists: false }));
    vi.mocked(adminDb.collection).mockReturnValue({
      doc: vi.fn(() => ({
        get: mockGet,
      })),
    } as any);

    const request = new Request('http://localhost/api/articles/123');
    const params = Promise.resolve({ id: '123' });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Article not found');
  });

  it('should return article data if found', async () => {
    const mockData = { title: 'Test Article' };
    const mockGet = vi.fn(() => Promise.resolve({ 
      exists: true, 
      id: '123',
      data: () => mockData 
    }));
    
    vi.mocked(adminDb.collection).mockReturnValue({
      doc: vi.fn(() => ({
        get: mockGet,
      })),
    } as any);

    const request = new Request('http://localhost/api/articles/123');
    const params = Promise.resolve({ id: '123' });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.title).toBe('Test Article');
    expect(data.id).toBe('123');
  });
});
