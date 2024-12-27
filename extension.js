/**
 * Extension
 * Command Runner GNOME Shell Extension
 * @author     Asfaq Ahmed <asfaqahmed128@gmail.com>
 * @license    GPL-3.0-only
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License.
 */

const { St, Gio, Clutter, GLib } = imports.gi;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

let commandRunner;

function _getScriptsPath() {
  return GLib.build_filenamev([GLib.get_home_dir(), "scripts"]);
}

function _ensureScriptsFolder() {
  const scriptsPath = _getScriptsPath();
  const scriptsDir = Gio.File.new_for_path(scriptsPath);

  if (!scriptsDir.query_exists(null)) {
    return false;
  }

  return true;
}

function _refreshMenu() {
  commandRunner.menu.removeAll();

  const scriptsPath = _getScriptsPath();

  if (_ensureScriptsFolder()) {
    // Add the "Using ~/scripts folder" item only if the folder exists
    let noteItem = new PopupMenu.PopupMenuItem("Using ~/scripts folder");
    noteItem.setSensitive(false);
    commandRunner.menu.addMenuItem(noteItem);

    commandRunner.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

    // Load and list scripts
    const scriptDir = Gio.File.new_for_path(scriptsPath);
    try {
      const enumerator = scriptDir.enumerate_children(
        "standard::name",
        Gio.FileQueryInfoFlags.NONE,
        null
      );

      let hasScripts = false;
      let fileInfo;
      while ((fileInfo = enumerator.next_file(null)) !== null) {
        const fileName = fileInfo.get_name();
        if (fileName.endsWith(".sh")) {
          hasScripts = true;
          const menuItem = new PopupMenu.PopupMenuItem(fileName);
          menuItem.connect("activate", () => {
            const scriptPath = `${scriptsPath}/${fileName}`;
            const proc = new Gio.Subprocess({
              argv: [
                "gnome-terminal",
                "--",
                "bash",
                "-c",
                `${scriptPath}; exec bash`,
              ],
              flags: Gio.SubprocessFlags.NONE,
            });
            proc.init(null);
          });
          commandRunner.menu.addMenuItem(menuItem);
        }
      }

      if (!hasScripts) {
        let noScriptsItem = new PopupMenu.PopupMenuItem(
          "No .sh scripts found in ~/scripts"
        );
        noScriptsItem.setSensitive(false);
        commandRunner.menu.addMenuItem(noScriptsItem);
      }
    } catch (e) {
      logError(e, "Error enumerating scripts directory");
      let errorItem = new PopupMenu.PopupMenuItem("Error loading scripts");
      errorItem.actor.style = "color: red";
      commandRunner.menu.addMenuItem(errorItem);
    }
  } else {
    // Display a message prompting the user to create the folder
    let noFolderItem = new PopupMenu.PopupMenuItem(
      "Scripts folder not found. Create ~/scripts and add .sh files."
    );
    noFolderItem.setSensitive(false);
    commandRunner.menu.addMenuItem(noFolderItem);
  }
}

function init() {}

function enable() {
  commandRunner = new PanelMenu.Button(0.0, "Command Runner", false);

  const icon = new St.Icon({
    gicon: Gio.icon_new_for_string(`${Me.path}/icon.svg`),
    style_class: "system-status-icon",
  });

  commandRunner.add_child(icon);

  commandRunner.connect("button-press-event", () => {
    _refreshMenu();
  });

  Main.panel.addToStatusArea("CommandRunner", commandRunner);

  // Initial menu setup
  _refreshMenu();
}

function disable() {
  if (commandRunner) {
    commandRunner.destroy();
    commandRunner = null;
  }
}
