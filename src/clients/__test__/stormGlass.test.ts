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

  it("should exclude incomplete data points", async () => {
    const lat = -33.987654;
    const lng = 151.293048;
    const incompleteResponse = {
      hours: [
        {
          windDirection: {
            noaa: 300,
          },
          time: "2020-04-26T00:00:00+00:00",
        },
      ],
    };
    mockedAxios.get.mockResolvedValue({ data: incompleteResponse });

    const stormGlass = new StormGlass(mockedAxios);
    const response = await stormGlass.fetchPoints(lat, lng);
    expect(response).toEqual([]);
  });

  it("should get a generic error from StormGlass service when the request fail before reaching the service", async () => {
    const lat = -33.987654;
    const lng = 151.293048;
    mockedAxios.get.mockRejectedValue({ message: "Network Error" });

    const stormGlass = new StormGlass(mockedAxios);
    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      "Unexpected error when trying to communicate to StormGlass: Network Error"
    );
  });

  it("should get an StormGlassResponseError when the StormGlass service responds with error", async () => {
    const lat = -33.987654;
    const lng = 151.293048;
    mockedAxios.get.mockRejectedValue({
      response: {
        status: 429,
        data: { errors: ["Rate Limit reached"] },
      },
    });
    const stormGlass = new StormGlass(mockedAxios);
    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      `Unexpected error returned by the StormGlass service: Error: {"errors":["Rate Limit reached"]} Code: 429`
    );
  });
});
