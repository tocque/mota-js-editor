import { create } from 'zustand';

interface EditorState {
  // 编辑器模式
  brushMode: 'line' | 'rectangle' | 'tileset';
  layerMode: 'fgmap' | 'map' | 'bgmap';
  
  // 当前选择的楼层和图块
  currentFloor: string | null;
  selectedIcon: string | null;
  
  // 编辑器视图状态
  leftPanelVisible: boolean;
  rightPanelVisible: boolean;
  currentLeftTab: number;
  currentRightTab: number;
  
  // 是否为移动端
  isMobile: boolean;
  
  // 操作方法
  setBrushMode: (mode: 'line' | 'rectangle' | 'tileset') => void;
  setLayerMode: (mode: 'fgmap' | 'map' | 'bgmap') => void;
  setCurrentFloor: (floor: string | null) => void;
  setSelectedIcon: (icon: string | null) => void;
  setLeftPanelVisible: (visible: boolean) => void;
  setRightPanelVisible: (visible: boolean) => void;
  setCurrentLeftTab: (tab: number) => void;
  setCurrentRightTab: (tab: number) => void;
  setIsMobile: (isMobile: boolean) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  brushMode: 'line',
  layerMode: 'map',
  currentFloor: null,
  selectedIcon: null,
  leftPanelVisible: true,
  rightPanelVisible: true,
  currentLeftTab: 0,
  currentRightTab: 0,
  isMobile: false,
  
  setBrushMode: (mode) => set({ brushMode: mode }),
  setLayerMode: (mode) => set({ layerMode: mode }),
  setCurrentFloor: (floor) => set({ currentFloor: floor }),
  setSelectedIcon: (icon) => set({ selectedIcon: icon }),
  setLeftPanelVisible: (visible) => set({ leftPanelVisible: visible }),
  setRightPanelVisible: (visible) => set({ rightPanelVisible: visible }),
  setCurrentLeftTab: (tab) => set({ currentLeftTab: tab }),
  setCurrentRightTab: (tab) => set({ currentRightTab: tab }),
  setIsMobile: (isMobile) => set({ isMobile }),
}));
