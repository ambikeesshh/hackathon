async function run() {
  try {
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyDlydcBgRyq6iyEKD0VRKIU4eFYH0If3Wk");
    const data = await response.json();
    console.log("Available models:", data.models?.map(m => m.name).join("\\n") || data);
  } catch (e) {
    console.error(e);
  }
}
run();
