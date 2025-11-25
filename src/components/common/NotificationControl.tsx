import React, { useState } from 'react';
import { useTranslation } from '../../context/LocaleContext';

const NotificationControl: React.FC = () => {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const { t } = useTranslation();

    // In a future phase, this would trigger Web Push API logic.
    const handleChange = () => {
        setNotificationsEnabled(!notificationsEnabled);
    };

    return (
        <div className="notifications-toggle">
            <span>{t('notifications_enabled')}</span>
            <label className="switch">
                <input type="checkbox" checked={notificationsEnabled} onChange={handleChange} />
                <span className="slider"></span>
            </label>
        </div>
    );
};

export default NotificationControl;