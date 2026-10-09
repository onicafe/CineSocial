import type { Badge } from '../../types';
import './BadgeDisplay.css';

interface BadgeDisplayProps {
    badge: Badge;
    size?: 'sm' | 'md' | 'lg';
}

export function BadgeDisplay({ badge, size = 'md' }: BadgeDisplayProps) {
    return (
        <div className="badge-container">
            <div className={`badge-circle ${size}`}>
                <span className="badge-icon">{badge.icon}</span>
            </div>

            {/* Tooltip */}
            <div className="badge-tooltip">
                <div className="tooltip-content">
                    <p className="tooltip-title">{badge.name}</p>
                    <p className="tooltip-desc">{badge.description}</p>
                    <p className="tooltip-date">
                        Earned {badge.unlocked_at ? new Date(badge.unlocked_at).toLocaleDateString() : 'Locked'}
                    </p>
                </div>
            </div>
        </div>
    );
}
