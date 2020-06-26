import { MaybeStrokeStyle, StrokeStyle, Point } from "./types";

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

    export const RadiansToVector = (rad: number) : Point => {
        return {
            x: Math.cos(rad),
            y: Math.sin(rad)
        };
    }
}

export default Helpers;