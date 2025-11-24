export const OrganizationStatuses = {
    Inited: 'inited',
    Active: 'active',
    Inactive: 'inactive',
    Deleted: 'deleted',
    Paused: 'paused',
    ErrorApiKey: 'errorApiKey',
};
// Функция для отображения читаемого статуса
const statusMapper = (status) => {
    switch (status) {
        case OrganizationStatuses.Inited:
            return 'Инициализировано';
        case OrganizationStatuses.Active:
            return 'Активно';
        case OrganizationStatuses.Inactive:
            return 'Неактивно';
        case OrganizationStatuses.Deleted:
            return 'Удалено';
        case OrganizationStatuses.Paused:
            return 'Приостановлено';
        case OrganizationStatuses.ErrorApiKey:
            return 'Ошибка API ключа';
        default:
            return status;
    }
};

export { statusMapper };
