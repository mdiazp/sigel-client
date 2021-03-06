export class WorkingWeekDay {
  constructor(public weekDayName: string,
              public working: boolean,
              public needConfirmation: boolean) {}
}

export class WorkingMonth {
  constructor(public monthName: string,
              public working: boolean) {}
}

export class WorkingTimeUtil {
  weekDays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  months = ['Enero', 'Febrero', 'Marzo', 'Abril',
            'Mayo', 'Junio', 'Julio', 'Agosto',
            'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  constructor() {}

  GetWorkingWeekDays( config: string ): WorkingWeekDay[] {
    let wds: WorkingWeekDay[]; wds = [];
    for ( let i = 0; i < config.length; i++ ) {
      const c = config[i];
      wds.push(new WorkingWeekDay(this.weekDays[i], (c !== '0'), (c === '2')));
    }
    return wds;
  }

  GetWorkingWeekDaysConfig( wds: WorkingWeekDay[] ): string {
    let config: string; config = '0000000';
    for ( let i = 0; i < wds.length; i++ ) {
      if ( wds[i].working ) {
        config = config.slice(0, i).concat(
          (wds[i].needConfirmation ? '2' : '1'),
          config.slice(i + 1)
        );
      }
    }
    return config;
  }

  GetWorkingMonths(config: string): WorkingMonth[] {
    let wms: WorkingMonth[]; wms = [];
    for ( let i = 0; i < config.length; i++ ) {
      wms.push(new WorkingMonth(this.months[i], (config[i] === '1')));
    }
    return wms;
  }

  GetWorkingMonthsConfig(wms: WorkingMonth[]): string {
    let config: string; config = '000000000000';
    for ( let i = 0; i < wms.length; i++ ) {
      if ( wms[i].working ) {
        config = config.slice(0, i).concat(
          '1',
          config.slice(i + 1, config.length)
        );
      }
    }
    return config;
  }

  IsWorking(date: Date, monthConfig: string, wdConfig: string): boolean {
    if ( monthConfig[date.getMonth()] === '0' ||
         wdConfig[date.getDay()] === '0' ) {
      return false;
    }
    return true;
  }
}
