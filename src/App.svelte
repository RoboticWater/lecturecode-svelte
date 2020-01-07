<script>
	import CodeMirror from "codemirror";
	import axios from 'axios';
	import "codemirror/mode/javascript/javascript.js";
	import "codemirror/mode/handlebars/handlebars.js";
	import "codemirror/mode/xml/xml.js";
	
	import { onMount } from 'svelte';

	import FileNode from './FileNode.svelte';
	let treeroot = { name: 'root', files: [{name: 'test', files: [{name: 'foo', content: ''}]}, {name: 'test', content: 'a'}] }
	let test = '<div class="root">\n	<div class="filetree">\n		<FileNode {...treeroot}/>\n		</div>\n		<div class="content">\n	</div>\n</div>'
	let content;
	var editor;

	let tab = 2
	$: if (tab && editor) {
		editor.setOption('tabSize', tab);
	}

	let files = [
		{
			"_id": "5e14b85785611f0021235e3d",
			"length": 5775,
			"chunkSize": 261120,
			"uploadDate": "2020-01-07T16:56:55.175Z",
			"filename": "8970edb881cd95d601a209a0ad3325bf.html",
			"md5": "96e1b64dc1d515ea35dc310d09af420b",
			"contentType": "text/html",
			"metadata": {
				"path": "\\index.html"
			}
		},
		{
			"_id": "5e14b86985611f0021235e46",
			"length": 7,
			"chunkSize": 261120,
			"uploadDate": "2020-01-07T16:57:13.968Z",
			"filename": "8746bdd12bd23baa26d15c7ff235d7ea.txt",
			"md5": "fb5bbae56b8143de28eac3f87404a45d",
			"contentType": "text/plain",
			"metadata": {
				"path": "\\test\\floop.txt"
			}
		},
		{
			"_id": "5e14b87385611f0021235e4f",
			"length": 494,
			"chunkSize": 261120,
			"uploadDate": "2020-01-07T16:57:23.836Z",
			"filename": "ee57a433bc209956c4cad4e9af5f1428.js",
			"md5": "0a129d40bde267247a1f08a5c6b15dbc",
			"contentType": "text/plain",
			"metadata": {
				"path": "\\test\\lame.js"
			}
		},
		{
			"_id": "5e14b87385611f0021235e4f",
			"length": 494,
			"chunkSize": 261120,
			"uploadDate": "2020-01-07T16:57:23.836Z",
			"filename": "ee57a433bc209956c4cad4e9af5f1428.js",
			"md5": "0a129d40bde267247a1f08a5c6b15dbc",
			"contentType": "text/plain",
			"metadata": {
				"path": "\\test\\test2\\lame2.js"
			}
		}
	]

	let t = {name: 'root', files: []}
	files.map(file => {
		let path = file.metadata.path.replace('./', '').replace(/\\/g, '/').split('/')
		return {reference: file.filename, path: path.slice(1, -1), name: path.slice(-1)[0]}
	}).forEach(file => {
		insertFile(file, file.path, t);
	});	

	function insertFile(file, path, root) {
		if (path.length === 0) {
			root.files.push(file);
			return;
		}
		let folder = root.files.find(f => f.name === path[0]);
		if (folder) {
			insertFile(file, path.slice(1), folder)
		} else {
			root.files.push({name: path[0], files: []})
			insertFile(file, path.slice(1), root.files[root.files.length - 1])
		}
	}
	

	onMount(() => {
		editor = CodeMirror.fromTextArea(content, {
			lineNumbers: true,
			lineWrapping: true,
			indentWithTabs: true,
			indentUnit: 2,
			tabSize: tab,
			value: '',
			readOnly: true,
			autoCloseBrackets: true,
			autoCloseTags: true,
			mode: {
				name: 'handlebars',
				base: 'text/html'
			},
			theme: 'material',
		});
	})
</script>

<div class="root">

	<img class="logo" src="./logo-01.svg" alt="">
	<div class="topbar">
		<div class="option">
			<div class="option__header">tab size:</div>
			<input class="option__value" type="number" bind:value={tab} min="0">
			<!-- <input class="option__value" type="number" on:change={e => {editor.setOption('tabSize', e.target.value);}} value={editor ? editor.options.tabSize : ''} min="0"> -->
		</div>
	</div>
	<div class="filetree">
		{#each t.files as file}
			<FileNode {...file} updateContent={() => {}} collapse={false}/>
		{/each}
	</div>
	<div class="content">
		<textarea
			bind:this={content}
			readonly
			value={test}
			style='display: none'
		></textarea>
	</div>
</div>

<style>
	.root {
		display: grid;
		grid-template-areas: "logo topbar" "filetree content";
		grid-template-columns: 200px 1fr;
		grid-template-rows: 50px 1fr;
		height: 100%;
	}
	.content {
		grid-area: content;
	}
	.content :global(.CodeMirror) {
		width: 100%;
		border-top-left-radius: 10px;
		padding-top: 5px;
		height: calc(100% - 5px);
	}
	.filetree {
		grid-area: filetree;
		padding: 5px 20px;
		display: flex;
		flex-direction: column;
	}
	.logo {
		grid-area: logo;
	}
	.topbar {
		grid-area: topbar;
		display: flex;
		align-items: end;
	}
	.option {
		color: #555;
		display: flex;
		height: 20px;
		margin-top: auto;
		padding: 10px 5px;
	}
	.option input {
		color: #555;
		border: none;
		height: 100%;
		width: 50px;
		margin-left: 3px;
	}
</style>