import { format, differenceInMinutes } from "date-fns";

const StandardDateTimeFormat = "M/dd/yyyy";

/*###Esta función buscará una fecha pasada y la formateará apropiadamente para facilitar la lectura.*/
const getTimePastIfLessThanDay = (compTime: Date | null): string => {
  if (!compTime) return "";
  const now = new Date();
  const diffInMinutes = differenceInMinutes(now, compTime);//diferencia en minutos entre la fecha actual y la publicacion

  if (diffInMinutes > 60) {
    //si la fecha es uperios a un dia o aun se puede identifica rla fecha en horas, dias o meses
    if (diffInMinutes > 24 * 60) {
      return format(compTime, StandardDateTimeFormat.toString());
    }
    return Math.round(diffInMinutes / 60) + "h ago";
  }
  return Math.round(diffInMinutes) + "m ago";
};

export { getTimePastIfLessThanDay };
