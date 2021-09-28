export interface IHoliday {
  country: string;
  holidays: Array<{
    name: string;
    day: string;
    month: string;
    observed: string;
    public: boolean;
  }>;
}
