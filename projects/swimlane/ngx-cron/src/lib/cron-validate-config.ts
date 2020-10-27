export const cronValidateConfig = {
  preset: 'default',
  override: {
    useSeconds: false,
    useLastDayOfMonth: true,
    useLastDayOfWeek: true,
    useAliases: true,
    useNthWeekdayOfMonth: true,
    useNearestWeekday: true,
    useBlankDay: true
  }
};
