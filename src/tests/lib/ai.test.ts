import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateSummary, verifyArticle, translateArticle, generateAudioForArticle, analyzeUploadedArticle, generateIntelligence } from '@/lib/ai/index';
import { getDoc, updateDoc, getDocs } from 'firebase/firestore';
import { geminiModel } from '@/lib/gemini';

// Mock Firebase functions
vi.mock('firebase/firestore', async () => {
  const actual = await vi.importActual('firebase/firestore');
  return {
    ...actual,
    doc: vi.fn(),
    getDoc: vi.fn(),
    getDocs: vi.fn(() => Promise.resolve({ docs: [] })),
    updateDoc: vi.fn(),
    setDoc: vi.fn(),
    collection: vi.fn(),
    query: vi.fn(),
    orderBy: vi.fn(),
    limit: vi.fn(),
  };
});

describe('AI Logic Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Intelligent Synthesis (generateSummary)', () => {
    it('should return cached summary if it exists', async () => {
      const mockArticleData = {
        aiSummary: 'Existing summary',
        bulletPoints: ['Point 1'],
        actors: ['Actor 1'],
        timeline: [{ date: '2023', event: 'Event 1' }],
      };

      vi.mocked(getDoc).mockResolvedValueOnce({
        exists: () => true,
        data: () => mockArticleData,
      } as any);

      const result = await generateSummary('test-id');

      expect(result.summary).toBe('Existing summary');
      expect(result.bulletPoints).toContain('Point 1');
      expect(geminiModel.generateContent).not.toHaveBeenCalled();
    });

    it('should generate and save a new summary if not cached', async () => {
      const mockArticleData = {
        title: 'New Event',
        source: 'Reuters',
        content: 'This is a test article content.',
      };

      vi.mocked(getDoc).mockResolvedValueOnce({
        exists: () => true,
        data: () => mockArticleData,
      } as any);

      const mockAIResponse = {
        response: {
          text: () => JSON.stringify({
            summary: 'Generated summary',
            bulletPoints: ['Point A', 'Point B'],
            actors: ['Actor A'],
            timeline: [{ date: 'Today', event: 'Something happened' }],
          }),
        },
      };

      vi.mocked(geminiModel.generateContent).mockResolvedValueOnce(mockAIResponse as any);

      const result = await generateSummary('test-id');

      expect(result.summary).toBe('Generated summary');
      expect(result.bulletPoints).toHaveLength(2);
      expect(updateDoc).toHaveBeenCalled();
    });
  });

  describe('Automated Verification (verifyArticle)', () => {
    it('should return trust score and reasoning', async () => {
      vi.mocked(getDoc).mockResolvedValueOnce({
        exists: () => true,
        data: () => ({ title: 'Fake News', content: 'Lies' }),
      } as any);

      const mockAIResponse = {
        response: {
          text: () => JSON.stringify({
            trustScore: 'Low',
            trustPercentage: 20,
            mainClaim: 'Unverified claim',
            reasoning: 'Lack of sources',
            agreementLevel: 'Low',
            sources: [],
            contradictions: ['Contradicts reality'],
          }),
        },
      };

      vi.mocked(geminiModel.generateContent).mockResolvedValueOnce(mockAIResponse as any);

      const result = await verifyArticle('test-id');

      expect(result.trustScore).toBe('Low');
      expect(result.trustPercentage).toBe(20);
      expect(result.contradictions).toContain('Contradicts reality');
    });
  });

  describe('Multilingual Support (translateArticle)', () => {
    it('should translate article content to target language', async () => {
      vi.mocked(getDoc).mockResolvedValueOnce({
        exists: () => true,
        data: () => ({ title: 'Hello', content: 'World' }),
      } as any);

      const mockAIResponse = {
        response: {
          text: () => JSON.stringify({
            translatedTitle: 'Hola',
            translatedContent: 'Mundo',
            language: 'es',
          }),
        },
      };

      vi.mocked(geminiModel.generateContent).mockResolvedValueOnce(mockAIResponse as any);

      const result = await translateArticle('test-id', 'es');

      expect(result.translatedTitle).toBe('Hola');
      expect(result.translatedContent).toBe('Mundo');
    });
  });

  describe('Audio Generation (generateAudioForArticle)', () => {
    it('should return a podcast script and browser-tts flag', async () => {
      vi.mocked(getDoc).mockResolvedValueOnce({
        exists: () => true,
        data: () => ({ title: 'Audio Story', description: 'Brief info' }),
      } as any);

      const result = await generateAudioForArticle('test-id');

      expect(result.audioUrl).toBe('browser-tts');
      expect(result.podcastScript).toContain('Audio Story');
      expect(updateDoc).toHaveBeenCalled();
    });
  });

  describe('Multimodal Vision (analyzeUploadedArticle)', () => {
    it('should analyze image and return insights', async () => {
      const mockVisionResponse = {
        response: {
          text: () => JSON.stringify({
            extractedText: 'Text from image',
            summary: 'Image summary',
            bulletPoints: ['Insight 1'],
            insights: 'Deep analysis',
          }),
        },
      };

      const { geminiVisionModel } = await import('@/lib/gemini');
      vi.mocked(geminiVisionModel.generateContent).mockResolvedValueOnce(mockVisionResponse as any);

      const result = await analyzeUploadedArticle('base64data', 'image/png');

      expect(result.extractedText).toBe('Text from image');
      expect(result.summary).toBe('Image summary');
    });
  });

  describe('Collective Intelligence (generateIntelligence)', () => {
    it('should synthesize a global signal from multiple articles', async () => {
      vi.mocked(getDocs).mockResolvedValueOnce({
        docs: [
          { data: () => ({ title: 'A', source: 'S', aiSummary: 'Sum' }) }
        ],
      } as any);

      const mockAIResponse = {
        response: {
          text: () => JSON.stringify({
            topSignal: 'Global Shift',
            keyInsight: 'Something major',
            confidence: 90,
          }),
        },
      };

      vi.mocked(geminiModel.generateContent).mockResolvedValueOnce(mockAIResponse as any);

      const result = await generateIntelligence();

      expect(result.topSignal).toBe('Global Shift');
      expect(result.confidence).toBe(90);
    });
  });
});

