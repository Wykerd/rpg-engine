import { MaybeStrokeStyle, StrokeStyle } from "./types";

namespace Helpers {
    export const StrokeStyleFromMaybe = (maybe?: MaybeStrokeStyle) : StrokeStyle => {
        return {
            strokeStyle: '#000',
            lineWidth: 1,
            lineCap: 'round',
            lineJoin: 'round',
            ...maybe
        }
    }
}

export default Helpers;