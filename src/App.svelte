<script>
	import CodeMirror from "codemirror";
	import axios from 'axios';
	import "codemirror/mode/javascript/javascript.js";
	import "codemirror/mode/handlebars/handlebars.js";
	import "codemirror/mode/xml/xml.js";
	
	import { onMount } from 'svelte';

	import FileNode from './FileNode.svelte';
	let treeroot = {name: 'root', files: []}
	let test = '<div class="root">\n	<div class="filetree">\n		<FileNode {...treeroot}/>\n		</div>\n		<div class="content">\n	</div>\n</div>'
	let content;
	var editor;

	let tab = 2
	$: if (tab && editor) {
		editor.setOption('tabSize', tab);
	}

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
		axios.get('/api/files')
		.then(res => {
			res.data.map(file => {
				let path = file.metadata.path.replace('./', '').replace(/\\/g, '/').split('/')
				return {reference: file.filename, path: path.slice(1, -1), name: path.slice(-1)[0]}
			}).forEach(file => {
				insertFile(file, file.path, treeroot);
			});
			treeroot = treeroot;
		})
		.catch(e => console.log(e));
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