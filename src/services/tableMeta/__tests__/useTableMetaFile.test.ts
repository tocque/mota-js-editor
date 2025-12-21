/**
 * useTableMetaFile 单元测试
 *
 * 测试表格元数据文件 React Query Hook 的功能
 * **Validates: Requirements 1.1, 2.1, 3.4**
 *
 * @vitest-environment jsdom
 */

import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTableMetaFile, getTableMetaQueryKey } from '../useTableMetaFile';
import * as tableMetaService from '../tableMetaService';

// Mock tableMetaService
vi.mock('../tableMetaService', async () => {
  const actual = await vi.importActual('../tableMetaService');
  return {
    ...actual,
    loadTableMetaFile: vi.fn(),
    saveTableMetaFile: vi.fn(),
  };
});

// 创建测试用的 QueryClient
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

// Wrapper component for providing QueryClient context
function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

describe('useTableMetaFile', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createTestQueryClient();
    vi.clearAllMocks();
  });

  afterEach(() => {
    queryClient.clear();
  });

  describe('加载成功场景', () => {
    it('应该成功加载文件内容', async () => {
      const mockContent = 'var test = { _type: "object" };';
      vi.mocked(tableMetaService.loadTableMetaFile).mockResolvedValue(mockContent);

      const { result } = renderHook(() => useTableMetaFile('dataComment'), {
        wrapper: createWrapper(queryClient),
      });

      // 初始状态应该是加载中
      expect(result.current.isLoading).toBe(true);
      expect(result.current.content).toBeUndefined();

      // 等待加载完成
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // 验证加载结果
      expect(result.current.content).toBe(mockContent);
      expect(result.current.error).toBeNull();
      expect(result.current.fileKey).toBe('dataComment');
    });

    it('应该返回正确的 fileKey', async () => {
      vi.mocked(tableMetaService.loadTableMetaFile).mockResolvedValue('content');

      const { result } = renderHook(() => useTableMetaFile('functionsComment'), {
        wrapper: createWrapper(queryClient),
      });

      expect(result.current.fileKey).toBe('functionsComment');
    });
  });

  describe('加载失败场景', () => {
    it('应该处理加载错误', async () => {
      const mockError = new Error('读取文件失败');
      vi.mocked(tableMetaService.loadTableMetaFile).mockRejectedValue(mockError);

      const { result } = renderHook(() => useTableMetaFile('dataComment'), {
        wrapper: createWrapper(queryClient),
      });

      // 等待加载完成
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // 验证错误状态
      expect(result.current.error).toEqual(mockError);
      expect(result.current.content).toBeUndefined();
    });
  });

  describe('保存功能', () => {
    it('保存成功后应该更新缓存', async () => {
      const initialContent = 'var test = { _type: "object" };';
      const newContent = 'var test = { _type: "object", _data: {} };';

      vi.mocked(tableMetaService.loadTableMetaFile).mockResolvedValue(initialContent);
      vi.mocked(tableMetaService.saveTableMetaFile).mockResolvedValue(undefined);

      const { result } = renderHook(() => useTableMetaFile('dataComment'), {
        wrapper: createWrapper(queryClient),
      });

      // 等待初始加载完成
      await waitFor(() => {
        expect(result.current.content).toBe(initialContent);
      });

      // 执行保存
      await act(async () => {
        await result.current.save(newContent);
      });

      // 验证 saveTableMetaFile 被调用
      expect(tableMetaService.saveTableMetaFile).toHaveBeenCalledWith('dataComment', newContent);

      // 等待缓存更新
      await waitFor(() => {
        expect(result.current.content).toBe(newContent);
      });
    });

    it('保存时应该设置 isSaving 状态', async () => {
      vi.mocked(tableMetaService.loadTableMetaFile).mockResolvedValue('content');

      // 创建一个延迟的 Promise 来模拟保存过程
      let resolveSave: () => void;
      const savePromise = new Promise<void>((resolve) => {
        resolveSave = resolve;
      });
      vi.mocked(tableMetaService.saveTableMetaFile).mockReturnValue(savePromise);

      const { result } = renderHook(() => useTableMetaFile('dataComment'), {
        wrapper: createWrapper(queryClient),
      });

      // 等待初始加载完成
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // 开始保存
      let savePromiseResult: Promise<void>;
      act(() => {
        savePromiseResult = result.current.save('new content');
      });

      // 验证 isSaving 状态
      await waitFor(() => {
        expect(result.current.isSaving).toBe(true);
      });

      // 完成保存
      await act(async () => {
        resolveSave!();
        await savePromiseResult;
      });

      // 等待 isSaving 恢复
      await waitFor(() => {
        expect(result.current.isSaving).toBe(false);
      });
    });
  });

  describe('getTableMetaQueryKey', () => {
    it('应该返回正确的 query key', () => {
      expect(getTableMetaQueryKey('dataComment')).toEqual(['tableMetaFile', 'dataComment']);
      expect(getTableMetaQueryKey('comment')).toEqual(['tableMetaFile', 'comment']);
      expect(getTableMetaQueryKey('functionsComment')).toEqual(['tableMetaFile', 'functionsComment']);
    });
  });
});
