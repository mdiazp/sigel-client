export class Util {
    constructor() {}

    StrtoDate(s: string): Date {
        if (!s || s === null || s === '') {
            return null;
        }
        const d = new Date();
        d.setFullYear(this.getYear(s));
        d.setMonth(this.getMonth(s) - 1);
        d.setDate(this.getDay(s));
        d.setHours(this.getHours(s));
        d.setMinutes(this.getMinutes(s));
        d.setSeconds(this.getSeconds(s));
        return d;
    }

    DatetoStr( date: Date ): string {
        if ( !date || date === null ) {
            return null;
        }
        // console.log('Date to str ------------> ', date);
        const s = this.ItoStr(date.getFullYear(), 4) + '-' +
               this.ItoStr(date.getMonth() + 1, 2) + '-' +
               this.ItoStr(date.getDate(), 2) + 'T' +
               this.ItoStr(date.getHours(), 2) + ':' +
               this.ItoStr(date.getMinutes(), 2) + ':' +
               this.ItoStr(date.getSeconds(), 2) + 'Z';
        return s;
    }

    DateToDisplayValue(date: Date): string {
        const d = this.DatetoStr(date);
        const year = this.getYear(d);
        const month = this.getMonth(d);
        const day = this.getDay(d);
        return year + ' / ' +
            (month < 10 ? '0' : '') + month.toString() + ' / ' +
            (day < 10 ? '0' : '') + day.toString();
    }

    StrTimeToDisplayValue(date: string): string {
        const hours = this.getHours(date);
        const minutes = this.getMinutes(date);
        return (hours < 10 ? '0' : '') + hours.toString() + ':' +
               (minutes < 10 ? '0' : '') + minutes.toString();
    }

    // 0123456789012345678
    // 2018-11-07T11:53:22
    getYear(date: string): number {
        return this.StrtoInt(date.slice(0, 4));
    }

    getMonth(date: string): number {
        return this.StrtoInt(date.slice(5, 7));
    }

    getDay(date: string): number {
        return this.StrtoInt(date.slice(8, 10));
    }

    getHours(date: string): number {
        return this.StrtoInt(date.slice(11, 13));
    }

    getMinutes(date: string): number {
        return this.StrtoInt(date.slice(14, 16));
    }

    getSeconds(date: string): number {
        return this.StrtoInt(date.slice(17, 19));
    }

    before( date: string, date2: string ): boolean {
        if ( this.getYear(date) !== this.getYear(date2) ) {
            return this.getYear(date) < this.getYear(date2);
        }
        if ( this.getMonth(date) !== this.getMonth(date2) ) {
            return this.getMonth(date) < this.getMonth(date2);
        }
        if ( this.getDay(date) !== this.getDay(date2) ) {
            return this.getDay(date) < this.getDay(date2);
        }
        if ( this.getHours(date) !== this.getHours(date2) ) {
            return this.getHours(date) < this.getHours(date2);
        }
        if ( this.getMinutes(date) !== this.getMinutes(date2) ) {
            return this.getMinutes(date) < this.getMinutes(date2);
        }
        if ( this.getSeconds(date) !== this.getSeconds(date2) ) {
            return this.getSeconds(date) < this.getSeconds(date2);
        }

        return false;
    }

    ItoStr(x: number, size: number): string {
        let s = x.toString();
        while ( s.length < size ) {
            s = '0' + s;
        }
        return s;
    }

    private StrtoInt(s: string): number {
        let x = 0;
        for ( let i = 0; i < s.length; i++ ) {
            x *= 10;
            x += Number(s[i]);
        }
        return x;
    }
}
