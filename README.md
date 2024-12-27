# **Command Runner GNOME Shell Extension**

**Command Runner** is a GNOME Shell extension that allows you to easily execute scripts stored in a designated folder (`~/scripts`). It provides a convenient menu in the system panel to list and run `.sh` scripts without needing to navigate through your terminal.

---

## **Features**
- Automatically detects `.sh` scripts in the `~/scripts` folder.
- Launches scripts in a terminal with a single click.
- Simple setup: Just place your scripts in the `~/scripts` directory.

---

## **Requirements**
- GNOME Shell (Version 3.36)
- Terminal application (e.g., GNOME Terminal, bash)

---

## **Installation**

1. Install the extension
```
mkdir -p ~/.local/share/gnome-shell/extensions/
cd ~/.local/share/gnome-shell/extensions/
rm command-runner@asfaq_ahmed -rf
git clone https://github.com/Achu1ahm/command-runner
```
2. Activate the extension
    * Restart gnome-shell or logoff/logon.
    * Activate the extension in gnome-tweak-tool

## License

Licensed under the GNU General Public License. See `LICENSE` for details.