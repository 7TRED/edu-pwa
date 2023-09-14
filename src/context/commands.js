const commands = [
  {
    cmd: "\\summarize-yt",
    description: "To summarize the youtube videos",
    example: "$/summarize-yt <yt-link>",
  },
  {
    cmd: "\\suggestions",
    description: "To show a list of commands and what they do",
    example: "\\suggestions",
  },
];

export default commands;

export const commandsList = {
  SUMMARIZE_YT_VIDEO: "\\summarize-yt",
  HELP: "\\suggestions",
};

export function generateMarkdown(array) {
  let markdown = "";
  for (let item of array) {
    markdown += `- **Command**: \`${item.cmd}\`\n`;
    if (item.description) {
      markdown += `\t- **Description**: ${item.description}\n`;
    }
    if (item.example) {
      markdown += `\t- **Example**: \`${item.example}\``;
    }
    markdown += "\n";
  }
  return markdown;
}
