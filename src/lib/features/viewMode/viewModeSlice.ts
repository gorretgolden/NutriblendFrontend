import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ViewMode = "retail" | "wholesale";

interface ViewModeState {
  mode: ViewMode;
  chosen: boolean;
}

const STORAGE_KEY = "shop_view_mode";

function readInitialState(): ViewModeState {
  if (typeof window === "undefined") {
    return { mode: "retail", chosen: false };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.mode === "retail" || parsed?.mode === "wholesale") {
        return {
          mode: parsed.mode,
          chosen: parsed.chosen === true,
        };
      }
    }
  } catch {
    // Corrupt value — fall through to defaults
  }
  return { mode: "retail", chosen: false };
}

function persist(state: ViewModeState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or blocked — the in-memory choice still works this session
  }
}

const viewModeSlice = createSlice({
  name: "viewMode",
  initialState: readInitialState(),
  reducers: {
    setViewMode: (state, action: PayloadAction<ViewMode>) => {
      state.mode = action.payload;
      persist(state);
    },
    markViewModeChosen: (state) => {
      state.chosen = true;
      persist(state);
    },
    resetViewMode: (state) => {
      state.mode = "retail";
      state.chosen = false;
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch {
          // ignore
        }
      }
    },
  },
});

export const { setViewMode, markViewModeChosen, resetViewMode } = viewModeSlice.actions;
export default viewModeSlice.reducer;
