<script>
    import { onMount } from 'svelte'; 
    export let name;
    export let files = [];
    export let reference = null;
    export let updateParent = null;
    export let selected = false;
    export let collapse = true;
    export let updateContent;
    let nameRef;
    let filesRef;
    let filesHeight = 100000;

    onMount(() => {
        filesHeight = 0;
        if(files && files.length > 0) {
            filesRef.childNodes.forEach((child, i) => {
                filesHeight += child.getBoundingClientRect().height;
            });
        }
    })

    function update(childHeight, index) {
        if (!filesRef)
            return;
        let newHeight = 0;
        filesRef.childNodes.forEach((child, i) => {
            if (i === index) {
                newHeight += childHeight;
            } else {
                newHeight += child.getBoundingClientRect().height;
            }
        });
        filesHeight = newHeight;
        if (updateParent)
            updateParent((collapse ? 0 : filesHeight) + nameRef.getBoundingClientRect().height);
    }

    function handleClick(e) {
        e.stopPropagation();
        if (reference) {
            updateContent();
        } else if (files) {
            collapse = !collapse;
            update(0, -1);
        }
    }
</script>

<div class="node" class:collapse={collapse}>
    <div class="name" bind:this={nameRef} class:dropdown={files && files.length > 0} on:click={handleClick}>{name}</div>
    {#if files && files.length > 0}
        <div class="files" style={`max-height: ${filesHeight}px;`}>
            <div class="files-container" bind:this={filesRef}>
                {#each files as file, i}
                    <div class="file">
                        <svelte:self {...file} updateContent={updateContent} updateParent={(childHeight) => update(childHeight, i)}/>
                    </div>
                {/each}
            </div>
        </div>
    {/if}
</div>

<style>
    .node {
        display: inline;
        user-select: none;
        color: #263238;
    }
    .name {
        padding: 0px 5px 3px;
        position: relative;
        display: inline-block;
    }
    .name:hover {
        background: #263238;
        color: #fff;
        cursor: pointer;
    }
    .name:hover:after {
        border-left: 6px solid #fff;
    }
    .dropdown {
        padding-right: 20px;
    }
    .dropdown:after {
        content: '';
        position: absolute;
        top: 7px;
        right: 7px;
        width: 0; 
        height: 0; 
        border-top: 5px solid transparent;
        border-bottom: 5px solid transparent;
        border-left: 6px solid #263238;
        transition: transform 0.3s ease;
        transform: rotate(90deg);
    }
    .collapse > .name:after {
        transform: rotate(0);
    }
    .files {
        margin-left: 10px;
        transition: max-height 0.3s cubic-bezier(.36,.02,.1,.99);
        overflow: hidden;
        position: relative;
    }
    .collapse > .files {
        max-height: 0 !important;
    }
    .files-container {
        position: relative;
    }
    .files-container:after {
        content: '';
        position: absolute;
        border-left: #263238 solid 2px;
        top: 3px;
        bottom: 12px;
        left: 0;
    }
    .file {
        position: relative;
        margin-left: 7px;
    }
    .file:after {
        background: #263238;
        width: 6px;
        height: 2px;
        top: 11px;
        left: -7px;
        position: absolute;
        content: '';
    }
</style>