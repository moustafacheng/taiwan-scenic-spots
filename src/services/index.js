const API_ROUTE = "https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot";

// gets all city scenic spots, 30 spots per request, and skips (request times -1)*30 spots each time.
export async function getAllCityScenes(pageNumber) {
  try {
    const response = await fetch(
      `${API_ROUTE}/?$top=30&$skip=${pageNumber}&$format=JSON`
    );
    const data = await response.json();

    return data;
  } catch (e) {
    throw e;
  }
}

// gets the displayed city's scenic spots, 30 spots per request, and skips (request times -1)*30 spots each time.
export async function getCityScenes(pageNumber, cityName) {
  try {
    const response = await fetch(
      `${API_ROUTE}/${cityName}?$top=30&$skip=${pageNumber}&$format=JSON`
    );
    const data = await response.json();

    return data;
  } catch (e) {
    throw e;
  }
}
