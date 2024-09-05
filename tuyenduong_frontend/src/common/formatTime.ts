import moment from 'moment'
import { registerLocale } from 'react-datepicker'
import vi from 'date-fns/locale/vi'
registerLocale('vi', vi)
export const formatTime = (
  ob: Date,
  hour: number,
  minute: number,
  second: number,
  action: string,
) => {
  if (action === 'add') {
    return moment(ob)
      .utcOffset(0)
      .set({
        hour,
        minute,
        second,
      })
      .toDate()
  }
  else
    return moment(ob).subtract(1, 'd')
      .utcOffset(0)
      .set({
        hour,
        minute,
        second,
      })
      .toDate()
}
