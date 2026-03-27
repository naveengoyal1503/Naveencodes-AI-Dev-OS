(async () => {
  try {
    await import("./apps/backend/dist/index.js");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
