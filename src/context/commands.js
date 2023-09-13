const commands = [
  {
    cmd: "$/summarize-yt",
    description: "To summarize the youtube videos",
    example: "$/summarize-yt <yt-link>",
  },
  {
    cmd: "$/help",
    description: "To show a list of commands and what they do",
  },
];

export default commands;

export const commandsList = {
  SUMMARIZE_YT_VIDEO: "$/summarize-yt",
  HELP: "$/help",
};

export function generateMarkdown(array) {
  let markdown = "";
  for (let item of array) {
    markdown += `- **Command**: \`${item.cmd}\`\n`;
    if (item.description) {
      markdown += `  - **Description**: ${item.description}\n`;
    }
    if (item.example) {
      markdown += `  - **Example**: \`${item.example}\`\n`;
    }
    markdown += "\n";
  }
  return markdown;
}
