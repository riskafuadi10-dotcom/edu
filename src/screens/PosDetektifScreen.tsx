import React from 'react';
import { PlayerState, Badge } from '../types';
import { DesaMisiScreen } from './DesaMisiScreen';

interface PosDetektifScreenProps {
  player: PlayerState;
  onCompleteDetective: (earnedXp: number, badge: Badge) => void;
  onAddXp?: (amount: number) => void;
  onBackToForest: () => void;
  onGoToMapAfterUnlock: () => void;
}

export const PosDetektifScreen: React.FC<PosDetektifScreenProps> = ({
  player,
  onCompleteDetective,
  onAddXp,
  onBackToForest,
  onGoToMapAfterUnlock,
}) => {
  return (
    <DesaMisiScreen
      player={player}
      onBackToMap={onBackToForest}
      onCompleteDetective={(xp, badge) => {
        onCompleteDetective(xp, badge);
      }}
      onAddXp={onAddXp}
      initialMateriId={player.selectedMateriId || undefined}
    />
  );
};
