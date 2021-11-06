import fs from "fs-extra";
import { join, relative, resolve } from "path";
import EventEmitter from "./EventEmitter.js";
import VFile, { hasExtension } from "./VFile.js";

const _DEFAULT_OPTIONS = {
	filterFiles: () => true,
	filterDirs: () => true
};

/**
 * @class FileWalker
 */
export class FileWalker extends EventEmitter {
	/**
	 * Build a new FileWalker EventEmitter
	 * @constructor
	 * @param String [rootDir=""]
	 * @param {FileWalkerOptions} options
	 */
	constructor(rootDir = "", opts = _DEFAULT_OPTIONS) {
		super();
		if (typeof rootDir === "object") {
			// rootDir argument was not passed
			opts = rootDir;
			rootDir = "";
		}
		this._fileCount = 0;
		this.setRootDir(rootDir)
			.filterFiles(opts.filterFiles)
			.filterDirs(opts.filterDirs);
	}

	setRootDir(dir) {
		const absoluteDir = resolve(dir);
		this._rootDir = absoluteDir;
		return this;
	}
	/**
	 * Define the file filter
	 * @param {Function<VFile>} fn Must return a boolean to append the file to the list of file events
	 * @return {FileWalker}
	 */
	filterFiles(fn = _DEFAULT_OPTIONS.filterFiles) {
		if (typeof fn !== "function") {
			throw new TypeError(
				`FileWalker() The 'filterFiles' and 'filterDirs' must be functions`
			);
		}
		this._filterFiles = fn;
		return this;
	}
	/**
	 * Define the directories filter
	 * @param {Function<VFile>} fn return TRUE to explore the directory content, FALSE to skip
	 * @return {FileWalker}
	 */
	filterDirs(fn = _DEFAULT_OPTIONS.filterDirs) {
		if (typeof fn !== "function") {
			throw new TypeError(
				`FileWalker() The 'filterFiles' and 'filterDirs' must be functions`
			);
		}
		this._filterDirs = fn;
		return this;
	}

	/**
	 * Explore one directory level and emits events based on what is found
	 * @param {String} [dir=rootDir] full path of the directory to explore (can be passed to the constructor instead)
	 */
	async explore(dir) {
		if (!dir) dir = this._rootDir;

		try {
			if (!dir || !fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
				this.emit("error", {
					message: `FileWalker() The directory to explore doesn't exist. (${dir}/)`
				});
				return this;
			}

			const entries = await fs.readdir(dir, { withFileTypes: true });
			this._fileCount += entries.length;

			for (const entry of entries) {
				const entryFullPath = join(dir, entry.name);

				if (entry.isFile()) {
					// Emit a `file` event if it conforms to the spec
					if (this._filterFiles(VFile(entryFullPath))) {
						this.emit("file", relative(this._rootDir, entryFullPath));
					}
				} else if (entry.isDirectory()) {
					if (this._filterDirs(VFile(entryFullPath))) {
						this.emit("dir", relative(this._rootDir, entryFullPath));
						await this.explore(entryFullPath);
					}
				}
				this.checkDone();
			}
		} catch (err) {
			this.emit("error", err);
		}

		return this; // Chainable so that we can explore several directories in chain
	}

	checkDone() {
		this._fileCount--;
		if (this._fileCount === 0) {
			console.warn(`${this._fileCount} files remaining.. END`);
			this.emit("end");
		}
	}
}

/**
 * Get a list of paths to matching files inside a directory
 * @param {String} dir
 * @param {Array[String]} extensions - file extensions to retrieve
 * @return {Array[String]} matching paths relative to the provided root dir
 **/
export const getMatchingPaths = async (dir, extensions) => {
	try {
		const paths = [];

		await new Promise((resolve, reject) => {
			new FileWalker(dir)
				.filterFiles(hasExtension(extensions))
				.on("dir", (dir) => {
					console.debug(`Exploring ${dir} for more content`);
				})
				.on("file", (path) => {
					paths.push(path);
					console.debug(`File ${path} was added to content`);
				})
				.on("error", reject)
				.on("end", resolve)
				.explore();
		});

		return paths;
	} catch (err) {
		const ERR_MSG = `getStaticPaths(): Error when trying to retrieve files from "${dir}"\n${err}`;
		console.error(ERR_MSG);
		throw new Error(ERR_MSG);
	}
};

export default FileWalker;
