/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  CharacterType,
  GameScreen,
  PlayerState,
  calculateLevel,
  INITIAL_PLAYER_STATE,
  Badge,
} from './types';
import { loadPlayerState, savePlayerState, resetPlayerState } from './utils/storage';
import { playSound } from './utils/sound';

import { TopHUD } from './components/TopHUD';
import { OpeningScreen } from './screens/OpeningScreen';
import { CharacterSelectScreen } from './screens/CharacterSelectScreen';
import { WorldMapScreen } from './screens/WorldMapScreen';
import { ForestScreen } from './screens/ForestScreen';
import { PondokMateriScreen } from './screens/PondokMateriScreen';
import { BioskopScreen } from './screens/BioskopScreen';
import { PosDetektifScreen } from './screens/PosDetektifScreen';
import { DesaMisiScreen } from './screens/DesaMisiScreen';
import { DesaPetualangScreen } from './screens/DesaPetualangScreen';
import { ArenaGameScreen } from './screens/ArenaGameScreen';
import { TeacherAuthScreen } from './screens/TeacherAuthScreen';
import { TeacherDashboardScreen } from './screens/TeacherDashboardScreen';
import { ClassSubjectSelectScreen } from './screens/ClassSubjectSelectScreen';
import { EduverseDataService, INITIAL_TEACHERS } from './utils/eduStore';
import { Teacher } from './types';

export default function App() {
  const [player, setPlayer] = useState<PlayerState>(() => loadPlayerState());
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('opening');
  const [justUnlockedDetective, setJustUnlockedDetective] = useState<boolean>(false);
  const [justUnlockedArena, setJustUnlockedArena] = useState<boolean>(false);
  const [activeTeacher, setActiveTeacher] = useState<Teacher | null>(() => EduverseDataService.getActiveTeacher() || INITIAL_TEACHERS[0]);

  // Sync to localStorage on every change
  useEffect(() => {
    savePlayerState(player);
  }, [player]);

  // Handle character choice and naming
  const handleSaveCharacter = (name: string, character: CharacterType) => {
    setPlayer((prev) => ({
      ...prev,
      name,
      character,
      hasStarted: true,
    }));
    setCurrentScreen('world_map');
  };

  // Add XP helper with automatic level calculation
  const addPlayerXp = (amount: number) => {
    setPlayer((prev) => {
      const nextXp = prev.xp + amount;
      const nextLevel = calculateLevel(nextXp);
      return {
        ...prev,
        xp: nextXp,
        level: nextLevel,
      };
    });
  };

  // Complete Pondok Materi (+20 XP, unlocks Pos Detektif)
  const handleCompleteMateri = (earnedXp: number) => {
    setPlayer((prev) => {
      const nextXp = prev.materiCompleted ? prev.xp : prev.xp + earnedXp;
      const nextLevel = calculateLevel(nextXp);
      return {
        ...prev,
        materiCompleted: true,
        xp: nextXp,
        level: nextLevel,
      };
    });
    setJustUnlockedDetective(true);
  };

  // Complete Bioskop Belajar (+10 XP)
  const handleCompleteVideo = (earnedXp: number) => {
    setPlayer((prev) => {
      const nextXp = prev.videoCompleted ? prev.xp : prev.xp + earnedXp;
      const nextLevel = calculateLevel(nextXp);
      return {
        ...prev,
        videoCompleted: true,
        xp: nextXp,
        level: nextLevel,
      };
    });
  };

  // Complete Detective Mission (+30 XP, Detektif Energi Badge, unlocks Arena Game!)
  const handleCompleteDetective = (earnedXp: number, newBadge: Badge) => {
    setPlayer((prev) => {
      const alreadyEarned = prev.detectiveCompleted;
      const nextXp = alreadyEarned ? prev.xp : prev.xp + earnedXp;
      const nextLevel = calculateLevel(nextXp);

      const hasBadge = prev.badges.some((b) => b.id === newBadge.id);
      const nextBadges = hasBadge ? prev.badges : [...prev.badges, newBadge];

      const unlocked = prev.unlockedAreas.includes('arena')
        ? prev.unlockedAreas
        : [...prev.unlockedAreas, 'arena'];

      return {
        ...prev,
        detectiveCompleted: true,
        badges: nextBadges,
        unlockedAreas: unlocked,
        xp: nextXp,
        level: nextLevel,
      };
    });
    setJustUnlockedArena(true);
  };

  // Sound toggle
  const handleToggleSound = () => {
    setPlayer((prev) => {
      const nextSound = !prev.soundEnabled;
      if (nextSound) {
        playSound('click', true);
      }
      return {
        ...prev,
        soundEnabled: nextSound,
      };
    });
  };

  // Reset progress handler for teacher / student testing
  const handleResetProgress = () => {
    const fresh = resetPlayerState();
    setPlayer(fresh);
    setJustUnlockedDetective(false);
    setJustUnlockedArena(false);
    setCurrentScreen('opening');
  };

  // Determine whether to show TopHUD (show on gameplay screens)
  const showHUD = !['opening', 'character_select', 'teacher_auth', 'teacher_dashboard'].includes(currentScreen);

  return (
    <div className="min-h-screen flex flex-col bg-amber-50 text-slate-800 font-['Nunito',sans-serif] selection:bg-amber-300 selection:text-amber-950">
      {/* Top HUD Navigation Bar */}
      {showHUD && (
        <TopHUD
          player={player}
          currentScreen={currentScreen}
          onNavigate={(screen) => {
            playSound('click', player.soundEnabled);
            setCurrentScreen(screen);
          }}
          onToggleSound={handleToggleSound}
          onResetProgress={handleResetProgress}
          onSelectClassSubject={() => setCurrentScreen('select_class_subject')}
          onOpenTeacherPortal={() => setCurrentScreen(activeTeacher ? 'teacher_dashboard' : 'teacher_auth')}
        />
      )}

      {/* Screen Router */}
      <main className="flex-1 flex flex-col">
        {currentScreen === 'opening' && (
          <OpeningScreen
            player={player}
            onStart={() => setCurrentScreen('character_select')}
            onResume={() => setCurrentScreen('world_map')}
            onOpenTeacherPortal={() => setCurrentScreen('teacher_auth')}
          />
        )}

        {currentScreen === 'character_select' && (
          <CharacterSelectScreen
            player={player}
            onSaveCharacter={handleSaveCharacter}
            onBackToOpening={() => setCurrentScreen('opening')}
          />
        )}

        {currentScreen === 'world_map' && (
          <WorldMapScreen
            player={player}
            onSelectLocation={(loc) => setCurrentScreen(loc)}
            justUnlockedArena={justUnlockedArena}
            onDismissUnlockBanner={() => setJustUnlockedArena(false)}
          />
        )}

        {currentScreen === 'select_class_subject' && (
          <ClassSubjectSelectScreen
            player={player}
            onConfirmSelection={(classLevel, subject, materiId) => {
              setPlayer((prev) => ({
                ...prev,
                selectedClass: classLevel,
                selectedSubject: subject,
                selectedMateriId: materiId,
                materiCompleted: false,
              }));
              setCurrentScreen('forest');
            }}
            onBack={() => setCurrentScreen('world_map')}
          />
        )}

        {currentScreen === 'forest' && (
          <ForestScreen
            player={player}
            onEnterLocation={(loc) => setCurrentScreen(loc)}
            onBackToMap={() => setCurrentScreen('world_map')}
            justUnlockedDetective={justUnlockedDetective}
            onSelectClassSubject={() => setCurrentScreen('select_class_subject')}
          />
        )}

        {currentScreen === 'pondok_materi' && (
          <PondokMateriScreen
            player={player}
            onCompleteMateri={handleCompleteMateri}
            onBackToForest={() => setCurrentScreen('forest')}
          />
        )}

        {currentScreen === 'bioskop' && (
          <BioskopScreen
            player={player}
            onCompleteVideo={handleCompleteVideo}
            onBackToForest={() => setCurrentScreen('forest')}
          />
        )}

        {currentScreen === 'pos_detektif' && (
          <PosDetektifScreen
            player={player}
            onCompleteDetective={handleCompleteDetective}
            onAddXp={addPlayerXp}
            onBackToForest={() => setCurrentScreen('forest')}
            onGoToMapAfterUnlock={() => setCurrentScreen('world_map')}
          />
        )}

        {(currentScreen === 'desa_misi' || currentScreen === 'desa_petualang') && (
          <DesaMisiScreen
            player={player}
            onBackToMap={() => setCurrentScreen('world_map')}
            onCompleteDetective={handleCompleteDetective}
            onAddXp={addPlayerXp}
            onSelectMateri={(materiId, classLevel, subject) => {
              setPlayer((prev) => ({
                ...prev,
                selectedMateriId: materiId,
                selectedClass: classLevel,
                selectedSubject: subject,
              }));
            }}
          />
        )}

        {currentScreen === 'arena_game' && (
          <ArenaGameScreen
            player={player}
            onAddXp={addPlayerXp}
            onNavigate={(screen) => setCurrentScreen(screen)}
          />
        )}

        {currentScreen === 'teacher_auth' && (
          <TeacherAuthScreen
            onSuccessLogin={(teacher) => {
              setActiveTeacher(teacher);
              setCurrentScreen('teacher_dashboard');
            }}
            onBackToStudent={() => setCurrentScreen('world_map')}
            soundEnabled={player.soundEnabled}
          />
        )}

        {currentScreen === 'teacher_dashboard' && (
          <TeacherDashboardScreen
            teacher={activeTeacher || INITIAL_TEACHERS[0]}
            onLogout={() => {
              EduverseDataService.logoutTeacher();
              setActiveTeacher(null);
              setCurrentScreen('opening');
            }}
            onSwitchToStudentView={() => setCurrentScreen('select_class_subject')}
            soundEnabled={player.soundEnabled}
          />
        )}
      </main>
    </div>
  );
}
