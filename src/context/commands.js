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
  let i = 1;
  for (let item of array) {
    markdown += `
    ${i}. Command : ${`${item.cmd}`}
      - Description : ${item.description}
      - Example : ${`${item.example}`}

    `;
    i++;
  }
  return markdown;
}
