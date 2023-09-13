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
    markdown += `- **Command**: \`${item.cmd}\``;
    if (item.description) {
      markdown += `\n  - **Description**: ${item.description}`;
    }
    if (item.example) {
      markdown += `\n  - **Example**: \`${item.example}\``;
    }
    markdown += "\n";
  }
  return markdown;
}
