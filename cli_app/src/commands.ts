import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import process from "node:process";
const argv = yargs(hideBin(process.argv));

export default function commands() {
  argv
    .option("tag", {
      alias: "tag",
      type: "string",
      description: "A tag for your note",
    })
    .command(
      "add <note>",
      "add new note",
      (arg) => {
        return arg.positional("note", {
          type: "string",
          description: "A note contend",
        });
      },
      (yargs) => {
        const { note, tag } = yargs;
        console.log("add note --->", { note, tag });
      }
    )
    .command(
      "delete <note>",
      "delete note",
      (arg) => {
        return arg.positional("note", {
          type: "string",
          description: "Delete a note",
        });
      },
      (yargs) => {
        console.log("delete note --->", yargs?.note);
      }
    )
    .command(
      "web [port]",
      "start web server",
      (yargs) => {
        return yargs.positional("port", {
          describe: "The port to bind the server to",
          type: "number",
          default: 8080,
        });
      },
      (yargs) => {
        console.log("yargs --->", yargs);

        console.log("port --->", yargs?.port);
      }
    )
    .demandCommand(1)
    .parse();
}
