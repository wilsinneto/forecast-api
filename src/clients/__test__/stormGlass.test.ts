import axios from "axios";
import { StormGlass } from "@src/controllers/stormGlass";
import stormGlassWeather3HoursFixture from "@test/fixtures/stormGlass_weather_3_hours.json";
import stormGlassResponseNormalized3HoursFixture from "@test/fixtures/stormGlass_normalized_response_3_hours.json";

jest.mock("axios");

describe("StormGlass Client", () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;

  it("should return the normalized forecast from the StormGlass service", async () => {
    const lat = -33.987654;
    const lng = 151.293048;

    mockedAxios.get.mockResolvedValue({ data: stormGlassWeather3HoursFixture });

    const stormGlass = new StormGlass(axios);
    const response = await stormGlass.fetchPoints(lat, lng);
    expect(response).toEqual(stormGlassResponseNormalized3HoursFixture);
  });
});
