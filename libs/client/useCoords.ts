import { useEffect, useState } from "react";

// ? 좌표를 구하는 customHook

interface UseCoordsState {
  latitude: null | number;
  longitude: null | number;
}

export default function useCoords() {
  const [coords, setCoords] = useState<UseCoordsState>({
    latitude: null,
    longitude: null,
  });
  const onSuccess = ({
    coords: { latitude, longitude },
  }: GeolocationPosition) => {
    setCoords({ latitude, longitude });
  };
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(onSuccess);
  }, []);

  return coords;
}
