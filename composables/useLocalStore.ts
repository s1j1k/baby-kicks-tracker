export const useLocalStore = () => {
  function saveKicksLocal(kicksData: Array<Kick>) {
    // Get the current date and set the expiration for midnight tonight
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0); // Set to midnight tonight

    // Store the kicks data and the expiration timestamp
    const data = {
      kicks: kicksData,
      expiresAt: midnight.getTime(), // Expiry time in milliseconds
    };

    localStorage.setItem("kicksData", JSON.stringify(data));
  }

  function getKicksLocal() {
    // @ts-expect-error TODO fix error
    const storedData = JSON.parse(localStorage.getItem("kicksData"));

    if (storedData) {
      const now = new Date().getTime();
      // Check if the data has expired
      if (now > storedData.expiresAt) {
        localStorage.removeItem("kicksData"); // Clear expired data
        return null; // No data available
      }
      return storedData.kicks.map((kick: Kick) => {
        if (typeof kick.date == "string") {
          kick.date = new Date(kick.date); // Convert string date to Date object
        }
        return kick;
      });
    }

    return null; // No data found
  }

  return {
    saveKicksLocal,
    getKicksLocal,
  };
};
