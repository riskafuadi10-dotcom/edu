import { PlayerState, INITIAL_PLAYER_STATE } from '../types';

const STORAGE_KEY = 'eduverse_player_state_v1';

export function loadPlayerState(): PlayerState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_PLAYER_STATE;
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_PLAYER_STATE,
      ...parsed,
    };
  } catch (e) {
    console.error('Gagal membaca data Eduverse dari localStorage:', e);
    return INITIAL_PLAYER_STATE;
  }
}

export function savePlayerState(state: PlayerState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Gagal menyimpan data Eduverse ke localStorage:', e);
  }
}

export function resetPlayerState(): PlayerState {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Gagal mereset data Eduverse:', e);
  }
  return { ...INITIAL_PLAYER_STATE };
}
