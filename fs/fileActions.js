import fs from "node:fs/promises";

const CREATE_FILE = "create";
const DELETE_FILE = "delete";
const RENAME_FILE = "rename";
const ADD_TO_FILE = "add";

/**
 * Commands examples:
    create four.txt
    delete four.txt
    rename four.txt to final-four.txt
    add final-four.txt content: The file has been renamed and this is new content.
 */

export async function createFile({ content }) {
  if (!content.includes(CREATE_FILE)) return;

  const path = content.replace(CREATE_FILE, "").trim();
  try {
    await fs.access(path);
    console.log(`the file ${path} already created`);
  } catch (error) {
    if (error?.code === "ENOENT") {
      await fs.writeFile(path, "New created file");
      console.log(`the file ${path} has been created`);
    }
  }
}

export async function deleteFile({ content }) {
  if (!content.includes(DELETE_FILE)) return;

  const path = content.replace(DELETE_FILE, "").trim();
  try {
    await fs.access(path);
    await fs.unlink(path);
    console.log(`the file ${path} has been deleted`);
  } catch (error) {
    console.log(`the file ${path} doesn't exist`, error);
  }
}

export async function renameFile({ content }) {
  if (!content.startsWith(RENAME_FILE)) return;

  const commandBody = content.replace(RENAME_FILE, "").trim();
  const parts = commandBody.split(" to ");

  if (parts.length !== 2) {
    console.error(
      'Invalid rename format. Use: "rename <old_path> to <new_path>"'
    );
    return;
  }

  const oldPath = parts[0].trim();
  const newPath = parts[1].trim();

  if (!oldPath || !newPath) {
    console.error(
      "Invalid rename format. Both old and new paths are required."
    );
    return;
  }

  try {
    await fs.rename(oldPath, newPath);
    console.log(`Successfully renamed "${oldPath}" to "${newPath}".`);
  } catch (error) {
    if (error?.code === "ENOENT") {
      console.error(`Error: The file "${oldPath}" does not exist.`);
    } else {
      console.error(`Error renaming file:`, error);
    }
  }
}

export async function addToFile({ content }) {
  if (!content.startsWith(ADD_TO_FILE)) return;

  const commandBody = content.replace(ADD_TO_FILE, "").trim();
  const parts = commandBody.split(" content: ");

  if (parts.length !== 2) {
    console.error(
      'Invalid add format. Use: "add <path> content: <text_to_add>"'
    );
    return;
  }

  const path = parts[0].trim();
  const contentToAdd = parts[1]; // We don't trim this so we can add leading spaces if needed

  if (!path) {
    console.error("Invalid add format. File path is required.");
    return;
  }

  try {
    // fs.appendFile will create the file if it doesn't exist
    await fs.appendFile(path, contentToAdd + "\n");
    console.log(`Content was successfully added to "${path}".`);
  } catch (error) {
    console.error(`Error adding content to file "${path}":`, error);
  }
}
