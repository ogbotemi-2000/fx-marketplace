function save(blob, name) {
    name = name || 'download';

    // Use native saveAs in IE10+
    if (typeof navigator !== "undefined") {
        if (/MSIE [1-9]\./.test(navigator.userAgent)) {
            alert('IE is unsupported before IE10');
            return;
        }
        if (navigator.msSaveOrOpenBlob) {
            // https://msdn.microsoft.com/en-us/library/hh772332(v=vs.85).aspx
            alert('will download using IE10+ msSaveOrOpenBlob');
            navigator.msSaveOrOpenBlob(blob, name);
            return;
        }
    }

    // Construct URL object from blob
    var win_url = window.URL || window.webkitURL || window;
    var url = win_url.createObjectURL(blob);

    // Use a.download in HTML5
    var a = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
    if ('download'in a) {
        alert('will download using HTML5 a.download');
        a.href = url;
        a.download = name;
        a.dispatchEvent(new MouseEvent('click'));
        // Don't revoke immediately, as it may prevent DL in some browsers
        setTimeout(function() {
            win_url.revokeObjectURL(url);
        }, 500);
        return;
    }

    // Use object URL directly
    window.location.href = url;
    // Don't revoke immediately, as it may prevent DL in some browsers
    setTimeout(function() {
        win_url.revokeObjectURL(url);
    }, 500);
}

let all = qsa('body *:not(br):not(style):not(script):not(.tooltip):not(.tooltip * ):not(.edit-element)');
let ui_colour = {
    '.tooltip > .flex > .select-none': ['hover:*100']
}, cError = qs('.COMPONENT.error');

if(cError) cError.firstElementChild.textContent = 'new Error(...)', window.onerror = function(err) {
  cError.firstElementChild.textContent = err,
  cError.classList.remove('to-left')
}, promisify = cb=>new Promise(resolve=>setTimeout(_=>resolve(cb())));

function build_nodes(obj) {
    let element = d.createElement(obj.name), attr = obj.attributes, iH = 'innerHTML', iT = 'innerText', val;
    if (attr)
        for (let i = attr.length || Object.keys(attr).length; i--; )
            element.setAttribute(attr[i].name, attr[i].value);
    if (val = obj[iH]) {
        element[iH] = val
    } else if (val = obj[iT]) {
        element[iT] = val
    }
    val = element;
    if (obj.selectorStrings)
        val = {
            element,
            children: obj.selectorStrings.map(_=>element.qs(_))
        }

    return val;
}
function meetsCriteriaInParentTree(node, criteria, limit) {
    let _;
    for (_ = node; _ !== limit && (_ = _.parentNode,
    node &&= criteria(node)); )
        ;
    return node ? _ : node;
}
let tooltip, count = 0;
function init() {
    tooltip = document.querySelector(".tooltip.builder");
    let vars, processed;
    this.vars = vars = {},
    vars.dom_tree = {},
    vars.dom_tree.editor = {},
    vars.dom_tree.added_to_editor = new Map(),
    vars.dom_tree.editor.delegateToAndCreateBindings=vars.dom_tree.noop=function(){},
    vars.dom_tree.editor.promise ||= cb=>new Promise(resolve=>setTimeout(_=>resolve(cb()))),
    vars.dom_tree.editor.deleted=[],
    vars.dom_tree.editor.childArray=[],
    vars.dom_tree.editor.makeChildNodesAccessible=!!0,
        
    vars.dom_tree.editor.addToListAndPage = function(arg, popped_list, cb) {
        let next, created, stored=vars.dom_tree.currently_focused, index;
        
        popped_list ||= (created=!arg, vars.dom_tree.editor.listBank.shift().element),
        stored[that.vars.dom_tree.editor.insertionDirection === 'UP' ? 'before' : 'after'](vars.dom_tree.currently_focused=popped_list);
        
        if((index=stored.getAttribute('child-index'))!=void 0) {
          vars.dom_tree.currently_focused.style.cssText=stored.style.cssText,
          vars.dom_tree.currently_focused.appendChild(build_nodes({
            name: 'div',
            innerText: 'representational',
            attributes: {
              0: {
                name: 'class',
                value: 'pointer-events-none absolute bg-yellow-400 text-xs font-sans p-0.5 inline-block top-0 -mt-2.5 right-0 z-10'
              },
              length: 1
            }
          })),
          index=vars.dom_tree.editor.insertionDirection === 'UP'? --index:++index,
          vars.dom_tree.currently_focused.setAttribute('child-index', index),
          vars.dom_tree.editor.shouldRefreshList=!!0;
        }
        
        next = popped_list.qs('.text'),
        next.textContent ||= arg?.className||(created?'relative':''),
        next.focus(),
        popped_list.qs('.tag').textContent ||= arg&&arg.nodeName.toLowerCase()||'div';
        //popped_list.classList.add('pointer-events-none')
        arg ||= build_nodes({
            name: 'div',
            attributes: {
                0: {
                    name: 'class',
                    value: 'relative'
                },
                length: 1
            },
            innerText: ' '
        })
        if (cb) {
            cb()
        } else {
            vars.dom_tree.currently_editing_on_page[that.vars.dom_tree.editor.insertionDirection === 'UP' ? 'before' : 'after'](vars.dom_tree.currently_editing_on_page=arg)
        }
        vars.dom_tree.editor.latestAddition=vars.dom_tree.currently_editing_on_page
        vars.dom_tree.editor.refreshList()
    },
    vars.dom_tree.editor.domWalkerSpansBank = [],
    vars.dom_tree.editor.domWalkerSpansSkeletonObj = {
        name: 'li',
        innerHTML: `<span contenteditable='true' spellcheck="false" class='p-1' data-placeholder='<N>'></span><hr class='sep ver p-px bg-black'/><span class='p-1' contenteditable='true' spellcheck="false" data-placeholder='relation'></span>`,
        attributes: {
            0: {
                name: 'class',
                value: 'text-center whitespace-pre flex',
            },
            length: 1
        }
    }

    vars.dom_tree.editor.listBank = [],
    vars.dom_tree.editor.listBankRefill = 0,
    vars.dom_tree.editor.listItemsSkeletonObj = {
        name: 'li',
        innerHTML: `<div class="relative mb-1 p-1">
		<div class="rounded-inherit top-0 left-0 absolute overflow-hidden h-full w-full">
		  <div class="duration-700 origin-bottom-right -right-2 top-3/4 translate-y-1 p-10 shadow bg-yellow-50 shadow rounded-full transform scale-150 absolute"></div>
		  <div class="duration-700 origin-top-left -left-7 bottom-3/4 p-10 shadow bg-yellow-50 shadow rounded-full transform scale-150 absolute"></div>
		</div>
        <div>
		  <div spellcheck=false class="relative text whitespace-pre text-yellow-700 overflow-scroll text-xs outline-none shadow py-1 pl-0.5 rounded" contenteditable=true data-placeholder="className OR text"></div>
		</div>
      </div>
	  
	  <div class='wrap-on-line rounded-md decorate-parent'>
		<div class="decorate rounded-inherit top-0 left-0 absolute overflow-hidden h-full w-full">
		  <div style='--tw-bg-opacitya: 0.8' class="duration-700 origin-bottom-right -right-2 top-3/4 p-4 bg-white shadow rounded-full transform-gpu scale-150 absolute"></div>
		  <div style='--tw-bg-opacitya: 0.8' class="duration-700 origin-top-left -left-7 bottom-3/4 p-4 bg-white shadow rounded-full transform-gpu scale-150 absolute"></div>
		</div>
		<span class='relative flex flex-col items-start'>
		  <span data-placeholder='tagName' style='font-family: Arial;' class='tag font-fredoka' contenteditable="true" spellcheck="false"></span><div class='shadow cursor-pointer font-sans tooltip to-bottom absolute text-yellow-600 bg-yellow-50 p-0.5 whitespace-pre rounded'><i class='bg-yellow-200 shadow m-0.5 p-1 rounded-full fa fa-highlighter'></i>highlight</div>
		</span>
		
		<div class='w-auto relative'>
			<span style='--tw-bg-opacity:0.3' contenteditable='true' data-placeholder=[attribute]  class='attribute-name border-yellow-100 border-2 inline-block outline-none relative bg-yellow-200 p-1'></span>
		</div>
		<div class='w-full relative flex-1 overflow-y-hidden overflow-scroll'>
		  <div spellcheck="false" style='--tw-bg-opacity:0.2' class='attribute-value rounded-md border-gray-50 bg-gray-100 border-2 flex-1 h-auto outline-none text-yellow-600 pt-0.5 pl-1 whitespace-pre m-0.5 relative shadow w-auto' contenteditable></div>
	    </div>
	  </div>`,
        attributes: {
            0: {
                name: 'class',
                value: 'text-gray-700 relative'
            },
            length: 1
        },
        selectorStrings: ['.tag', '.text', '.wrap-on-line>*:last-child div']
    }
    for (let i = 50; i--; )
        vars.dom_tree.editor.listBank[i] = build_nodes(vars.dom_tree.editor.listItemsSkeletonObj),
        vars.dom_tree.editor.domWalkerSpansBank[i] = build_nodes(vars.dom_tree.editor.domWalkerSpansSkeletonObj);

    let tagNames = [], datalists = tooltip.qsa('.editor:not(.exempted) datalist'), children = datalists[0].lastElementChild.children, elements_updater = new Map(), tagNames_target, datalist_drag_handles = datalists.map(_=>new Draggabilly(_.parentNode,{
        handle: _.previousElementSibling
    }));

    for (let i = children.length - 1; i--; )
        tagNames[i] = children[i].getAttribute('val');
    for (let i = datalist_drag_handles.length; i--; ) {
        datalist_drag_handles[i].on('dragEnd', function() {

            datalists[i].parentNode.classList.add('is-pointer-up')
            datalists[i].parentNode.style.setProperty('--offset', datalists[i].parentNode.style.top)
            datalists[i].parentNode.style.top = '0px';
            setTimeout(()=>{
                datalists[i].parentNode.classList.remove('is-pointer-up')
            }, 0);
        })
    }
    vars.dom_tree.searchTags = function(t) {
        for (let i = tagNames.length, j = 0; j < i; )
            children[j].classList[(tagNames[j].charAt(0) === t.textContent.charAt(0) && tagNames[j].search(t.textContent.substr(1)) > -1) || !d.activeElement.innerText ? 'remove' : 'add']('hide'),
            j++
        let not_hidden;
        if ((not_hidden = children[0].parentNode.qs('*:not(.hide)')).tagName === 'DIV') {
            not_hidden.classList.add('opacity-100')
            tagNames_target = t
            //stored in a variable:'tagNames_target' beyond this context to be used as required
            pseudo_clickAbles[1].firstElementChild.textContent = `add ${tagNames_target.textContent} to sugggestions`
        } else {
            children[0].parentNode.lastElementChild.classList.remove('opacity-100')
        }
    },
        
    vars.dom_tree.editor.remove = function(args) {
      args[0]._r('style')('data').visibility=args[1].style.visibility='hidden', requestAnimationFrame(_=>args[0].remove()), args[1].remove();
      vars.dom_tree.editor.deleted.push([args[0], args[1]])
    }
    vars.dom_tree.toggle_switch = tooltip.qs('li button label.toggle-wrapper input'),
    vars.dom_tree.toggle_switch.checked = !!0;

    let clickAbles = tooltip.qsa('button')
      , pseudo_clickAbles = tooltip.qsa('[role="button"]');
    drag_handle = tooltip.qs('.drag-handle'),
    parent = tooltip.parentNode;

    let dragger, match, that = this, insrt = [t=>prot_H.insertBefore.bind(t), t=>t.firstElementChild];

    that.isHiddenByOverflow = function(node, _) {
        for (_ = node; _ !== d.body && (node = getStyle(_, 'overflow'),
        _ = _.parentNode,
        node &&= node.match(/visible/g)););
        return node;
    }
    that.refreshVariables = _=>pseudo_clickAbles = qsa('[role="button"]'),
    that.isInViewport = (e)=>(e = e.getBoundingClientRect(),
    e.top >= 0 && e.left >= 0 && e.bottom <= (w.innerHeight || html.clientHeight) && e.right <= (w.innerWidth || html.clientWidth))
    that.reset_class = function(arg, node) {
        node = node || tooltip;
        let match = node.className.match(/to-(top|bottom|left|right)/g);
        match && (arg ? node.classList.replace(match[0], arg) || node.classList.replace(arg, match[0]) : node.classList.remove(match[0]))
    }

    that.escapeCSS = _=>_.replace('\x5c', '').replace(/\[|\]\(|\)|\*/g, _=>'\\' + _).replace('/', '\\\\/').replace('.', '\\\\\\.').replace(/:/g, '\\\\:');
    let worker;
    try {/*worker = new Worker('js/worker.js');*/
    } catch (err) {}
    that.worker = function(arg, cb) {

        let rgx = /^[0-9]+/
          , match = arg.match(rgx)
          , replaced = arg.replace(rgx, '').replace(/^\|/, '');
        match &&= +match[0]
        if (worker) {
            worker.postMessage(match + replaced.replace(/^\|/, ''))

            if (!worker.omessage)
                worker.onmessage = m=>cb(m.data, [...m.data[0].keys()], [...m.data[0].values()])
            worker.onerror = _=>console.log(_)
        } else if (arg.substr(0, build.css.uuid.length) !== build.css.uuid && build.css[processed[match]]) {
            replaced = that.escapeCSS(replaced);

            let startsWith = build.css[processed[match]].filter(e=>e.replace(/^\./, '').startsWith(replaced))
              , search = build.css[processed[match]].filter(e=>e.search(replaced) > -1)

            search = [...startsWith.keys()].concat([...search.keys()])
            cb && cb([search, match], search, [...search.values()])
        }
    }
    let dom_output = tooltip.qs('.editor .dom-content ol');

    that.css = function(arg) {
        let css = this.css
          , notifier = tooltip.qs('.no-of-css-files')
          , dump = datalists[1].qs('.wrapper')
          , children = dump.children;

        if (!processed.length)
            for (let i = children, j = i.length; j-- > 0 && (i[j].remove(),
            !0); )
                ;
        if (processed.indexOf(arg.name) === -1) {
            notifier.innerText = arg.number + 1
            let div = d.createElement('div')
              , hr = d.createElement('hr');
            console.log('css.cacheIndexOffset', css.cacheIndexOffset, 'arg.number+css.cacheIndexOffset', arg.number + css.cacheIndexOffset, 'arg.number', arg.number);

            css[arg.name] = {
                nodes: [div, hr],
                text: arg.text,
                size: arg.size,
                lastModifiedDate: arg.lastModifiedDate,
                extend: function(_) {
                    return Styles.init(this.text + (_ || ''))
                },
                filter: function(fn_key, fn_val) {
                    return this.Styles().filteredMap(fn_key, fn_val, {
                        cache_index: /*arg.number<css.cacheIndexOffset?arg.number+css.cacheIndexOffset:*/
                        arg.number
                    })
                },
                Styles: function() {
                    return this.extend()
                },
                cssMap: function() {
                    return this.Styles().storedMap({
                        cache_index: /*arg.number<css.cacheIndexOffset?arg.number+css.cacheIndexOffset:*/
                        arg.number
                    })
                },
                specificAffects: function(namespace, f_key, f_val) {
                    return this.Styles().getNodes(namespace, f_key, f_val);
                },
                remove: _=>(processed.indexOf(_) > -1 && processed.splice(processed.indexOf(_), 1),
                css[_].nodes.forEach(n=>n.remove()),
                notifier.innerText = processed.length,
                delete css[_])
            }
            processed.push(arg.name);

            hr.className = 'sep unaffected bulge-center text-yellow-500 border-0 hor mb-4',
            div.className = 'flex flex-col text-center my-2 optgroup',
            div.innerHTML = `<div style='transition: none;' class='-translate-y-5 transform tooltip right-0 vanish-hover absolute flex items-start'>
			  
			  <span class='bars-3 text-gray-500 shadow h-4 w-3'></span><span class='relative truncate p-0.5 unaffected rounded text-xs shadow bg-yellow-100'>${arg.name}</span>
			  <data style='opacity: 1; visibility: visible' class='tooltip-parent relative unaffected px-1.5 py-0.5 fa-sm shadow bg-yellow-300 fa fa-chevron-down shadow text-gray-700 rounded' onclick='this.classList.toggle("fa-chevron-up"), this.parentNode.parentNode.classList.toggle("expand")'>
				<div style='left:unset; transform: translateX(0%); --arrow-x: 450%; --arrow-degree:45deg' class='right-4 p-1 to-bottom font-sans text-xs tooltip border-2 border-gray-50 bg-gray-100 text-gray-600 rounded absolute'>
				  <ul class='list-none'>
					<li class='unaffected cursor-pointer flex items-center justify-center p-1 space-x-1 hover:bg-gray-300'><i class='fa fa-plus p-1 shadow bg-gray-200 mr-1'></i>extend</li>
					<li class='unaffected cursor-pointer flex items-center justify-center p-1 space-x-1 hover:bg-gray-300'><i class='fa fa-trash p-1 shadow bg-gray-200 mr-1'></i>remove</li>
				  </ul>
				</div>
			  </data>
			</div>
			<option data-details='[1 of 4]' val='[no matched selector]'></option><option data-details='[2 of 4]' val='[no matched selector]'></option><option data-details='[3 of 4]' val='[no matched selector]'></option><option data-details='[4 of 4]' val='[no matched selector]'></option>
			<div style='left: ${(arg.number + css.cacheIndexOffset) * 40}px; display: none;' class='tooltip-parent bottom-full mb-16 -translate-y-6 transform hover:bg-yellow-50 customize h-auto rounded absolute rounded bg-yellow-100'>
			  <div class='text-left whitespace-pre inset-1 tooltip p-0.5 text-gray-700 hover:[&>*]:border-2:border-orange focus:[&>*]:border-2:border-orange font-fredoka'><p class='inline-block p-0.5 rounded' contenteditable=true spellcheck=false data-placeholder=selector></p> {<br><p class='inline-block p-0.5 rounded' contenteditable=true spellcheck=false data-placeholder='[property]'></p>:&nbsp;<p class='inline-block p-0.5 rounded' contenteditable=true data-placeholder='[value]' spellcheck=false></p><br>}</div>
			  <div class='cursor-pointer hover:[&>*]:border-2:border-orange cursor-pointer absolute top-full rounded-bl rounded-br bg-yellow-100 shadow flex px-2 items-center justify-center'>
				<i tabindex=0 class='unaffected py-2 px-1 hover:bg-yellow-200 h-full fa fa-dice shadow'><div class='tooltip to-left bg-yellow-300 whitespace-pre p-1 absolute'>generate uid</div></i>
				<i tabindex=0 class='unaffected py-2 px-1 fa fa-code shadow h-full hover:bg-yellow-200'><div class='tooltip to-right bg-yellow-300 p-1 whitespace-pre absolute'>edit</div></i>
			  </div>
			</div>`
            dump.appendChild(div)
            div.after(hr)
            that.refreshVariables()
        }
        /* warms up Styles.cached ahead of time */
        //console.log(arg.number, css.cacheIndexOffset, build.css.processed, arg.text.substr(0,200))
        css[arg.name].filter()
    }
    that.css.processed = processed ||= [];
    tooltip.qs('ol div[tabindex]').click,
    vars.dom_tree.editor.enterAsNewLine = tooltip.qs('.decorate-parent div:last-child > label input').checked=true, //sets Enter -> new line as default behaviour
    tooltip.addEventListener('click', function(e) {
        let target = e.target, _i, clicked = clickAbles.find((e,i)=>(e = relation(e, target)[0] || e == target,
        e && (_i = i,
        e))), _j, pseudo_clicked = pseudo_clickAbles.find((e,i)=>(e = relation(e, target)[0] || e == target,
        e && (_j = i,
        e))), path = e.composedPath(), callback, eventType, eventOrigin, cleanUp = (fn)=>()=>(console.log('called ', ++count, 'times'), eventOrigin.removeEventListener(eventType, callback),fn()),
        classList = target.classList;
        vars.dom_tree.editor.handleClickOnList = function(target) {
            if (target) {
                let text = target.classList.contains('text'), tag = target.classList.contains('tag'),
                has = tag || text, which, value, current_index, child_index,
                parent_on_list = objWalk(target, {
                    3: 'parentNode'
                });
                if (parent_on_list.tagName === 'LI') {
                    if (tag) {
                        which = 0,
                        vars.dom_tree.searchTags(target)
                    } else if (text) {
                        which = 1
                    }
                    current_index = parent_on_list.getAttribute('index'),
                    child_index   = parent_on_list.getAttribute('child-index'),
                    vars.dom_tree.editor.childIndex=void 0,
                    vars.dom_tree.currently_focused = parent_on_list;
                    
                    if(vars.dom_tree.editor.latestAddition) ~vars.dom_tree.editor.childArray.indexOf(vars.dom_tree.editor.latestAddition)||vars.dom_tree.editor.childArray.push(vars.dom_tree.editor.latestAddition);
                        
                    vars.dom_tree.currently_editing_on_page = vars.dom_tree.added_to_editor.get(parent_on_list)
                    || elements_updater.get('get')(current_index) || vars.dom_tree.editor.childArray[vars.dom_tree.editor.childIndex=child_index];
                    
                    if (has) {
                        value = datalists[which].parentNode;
                        if (current_index < 4) {
                            value.style.setProperty('--offset', 44 + current_index * 74 + 'px');
                        } else {
                            value.style.setProperty('--offset', '340px');
                        }
                        datalists.forEach((e,i)=>e.parentNode.classList[i === which ? 'add' : 'remove']('show-on-focus'))
    
                        eventType = 'blur',
                        eventOrigin = datalists[which].parentNode,
                        callback = function(e) {
                          cleanUp(_=>value.classList.remove('show-on-focus'))()
                        }
                    }
                }
            }
        }
        vars.dom_tree.editor.fireClickAndHighlightOnTarget = (validate,target,className,exec)=>{
            eventOrigin = target,
            eventType = 'click';
            //heads-up, EventTarget.addEventListener(...) is way down 
            let t;
            w.onkeydown=e=>{e.keyCode === 27 &&(w.onkeydown = null, cleanUp(()=>(this.classList.remove('not-here'), target.classList.remove('custom-cursor', className)))())};
            
            callback = event=>{
                event.preventDefault();
                t = event.target;
                if (validate(event)) {
                    w.onkeydown=null
                    
                    exec(event)
                    //a one-time event; appropriate to be removed this way
                    cleanUp(()=>(this.classList.remove('not-here'),
                        target.classList.remove('custom-cursor', className),
                        clickAbles[1].lastElementChild.innerText = t.firstElementChild !== this ? (clickAbles[1].removeAttribute('disabled'),
                        'append here') : (clickAbles[1].setAttribute('disabled', ''),
                        'appended')
                    ))();
                }
            }
        }
        if (clicked || pseudo_clicked) {

            switch (_i) {
            case 0:
                this.classList.add('not-here');
                let body = d.body, className = this.className;
                body.classList.add('custom-cursor', 'notify');

                vars.dom_tree.editor.fireClickAndHighlightOnTarget(event=>{
                    return event.target !== this && !relation(this, event.target)[0]
                    //if not tooltip or any descendant of tooltip
                }, body, 'notify', vars.dom_tree.editor.delegateToAndCreateBindings =arg=>{
                    
                    /*In order to hack this codebase so as to edit tooltip through a back door found by its owner, refractor this callback into a regular anonymous function so as to make this!==tooltip. (¬‿¬)*/
                    let t = arg.target || arg;
                    objWalk(clicked, {
                        2: 'firstElementChild'
                    }).textContent = t.style.cssText,
                    clicked.firstElementChild.lastElementChild.textContent = t.classList.toString().replace(/\s/g, ', '),

                    clicked.lastElementChild.innerHTML = `tagName: <span class='inline-block p-1 text-blue-600 bg-blue-100 rounded'>${t.tagName.toLowerCase()}</span>`;
                    vars.dom_tree.editor.promise(_=>vars.dom_tree.editor.selectedTarget=t).then(resolved=> {
                        
                        let children = prot_A.filter.call(vars.dom_tree.editor.selectedTarget.childNodes || [], e=>e !== this), cssText, fragMent = d.createDocumentFragment()
    
                        for (let i = dom_output.children, j = i.length; j-- > 0 && (i[j].remove(), !0); );
                        if (!children.length) children = [vars.dom_tree.editor.selectedTarget.appendChild(d.createTextNode(''))];
    
                          for (let i = 0, j = children.length; i < j; i++) {
                            let obj = vars.dom_tree.editor.listBank.shift()
                              , li = obj.element
                              , current = children[i]
                              , cssText = current.style?.cssText || ''
                              , values_array = [current.nodeName.toLowerCase(), objWalk(current, ['classList', 'data']).toString().trim(), cssText]
                            
                            vars.dom_tree.editor.promise(_=>li).then(_=>{
                              li.setAttribute('index', i),
                              li.setAttribute('data-after', '\\n/'),
                              values_array.forEach((e,i)=>obj.children[i].textContent=e);
                              
                              if(values_array[2]) objWalk(obj.children[2], ['parentNode','previousElementSibling', 'firstElementChild']).textContent='style'
                            });

                            vars.dom_tree.editor.indexer = index=>children[index] || vars.dom_tree.editor.childArray[vars.dom_tree.editor.childIndex] /*a brilliant effect of closures, disabled for now: || children[i]*/
                            fragMent.appendChild(li);
                        }
                        dom_output.appendChild(fragMent)
                        let bool = vars.dom_tree.editor.indexer;
                        elements_updater.set('[set-attribute]', (attr,index,node)=>((index = node || bool(index))?.tagName && index.setAttribute(attr.name, attr.value),
                        index));
    
                        elements_updater.set('[refresh-nodes]', arg=>children = prot_A.filter.call(vars.dom_tree.editor.selectedTarget.childNodes, e=>e !== this))
                        elements_updater.set('[remove]', index=>children[index] && children.splice(index, 1)[0])
    
                        elements_updater.set('get', index=>bool(index));
                        elements_updater.set('[change-element]', (_,index,node)=>_.toUpperCase() !== (index = node || bool(index)).nodeName.toUpperCase() && (_ = [d[_.charAt(0) !== '#' ? 'createElement' : 'createTextNode'](_.slice(_.charAt(0) === '#' && 5)), index.cloneNode('truthy')],
                            /*set textContent for element to have childNodes.length=1*/
                            _[0].innerHTML = index.innerHTML || ' ',
                            (_[0].data === void 0 && _[1].data === void 0) && (slice(_[1].attributes).forEach(attr=>_[0].setAttribute(attr.name, attr.value)),
                            _[0].innerHTML = _[1].innerHTML),
                            (relation(vars.dom_tree.editor.selectedTarget, index)[0]
                                ? vars.dom_tree.editor.selectedTarget
                                : index.parentNode
                            ).replaceChild(_[0], index),
                            index=_[0])
                        );
                        vars.dom_tree.added_to_editor.delete(vars.dom_tree.listsParent?.qs('li.ignore'))
                    });
                    for (; vars.dom_tree.editor.listBankRefill-- > 0;) vars.dom_tree.editor.listBank.push(build_nodes(vars.dom_tree.editor.listItemsSkeletonObj));
                    vars.dom_tree.editor.listBankRefill = children.length;
                });
                break;

            case 1:
                let is_able = clicked.getAttribute('disabled')
                  , last = clicked.lastElementChild;
                if (vars.dom_tree.editor.selectedTarget && (is_able === null || is_able !== 'true')) {
                    let tg = vars.dom_tree.editor.selectedTarget.tagName.toLowerCase();
                    if (tg === 'p' || tg === 'button' || tg === 'input') {
                        last.innerText = 'suprisingly does nothing (⊙x⊙;)'
                    } else {
                        that.reset_class(),
                        insrt[0](vars.dom_tree.editor.selectedTarget)(this, insrt[1](vars.dom_tree.editor.selectedTarget)),
                        last.innerText = 'appended',
                        tg === 'body' && tooltip.classList.replace('absolute', 'fixed')
                    }

                    !dragger && (dragger = new Draggabilly(tooltip,{
                        handle: drag_handle
                    }),
                    dragger.on('pointerDown', function() {
                        match = tooltip.className.match(/to-(top|bottom|left|right)/g);
                        match && tooltip.classList.remove(match[0])
                        drag_handle.qs('.status').innerText = 'drag here'
                    }),
                    dragger.on('dragEnd', function() {
                        match && tooltip.classList.add(match[0])
                        tooltip.classList.add('is-pointer-up')
                        setTimeout(()=>{
                            tooltip.classList.remove('is-pointer-up')
                        }
                        , 0);
                    }))
                    drag_handle.qs('.status').innerText = 'drag here'
                    !that.revert && (that.revert = function(className, node) {
                        that.reset_class(className)

                        if (!that.isHiddenByOverflow(tooltip) || !that.isInViewport(drag_handle))
                            last.innerText = 'append here',
                            insrt[0](node || d.body)(tooltip, insrt[1](node || d.body)),
                            node === d.body && tooltip.classList.replace('absolute', 'fixed'),
                            clicked.removeAttribute('disabled')
                    }
                    );
                    clicked.setAttribute('disabled', 'true');
                }

                break;
            case 2:
            case 3:
            case 4:
            case 5:
                this.style.removeProperty('left'),
                this.style.removeProperty('top')
                clickAbles[1].innerText === 'appended' && (drag_handle.qs('.status').innerText = 'reset')
                break;
            case 6:
                let checkbox = vars.dom_tree.toggle_switch, moveDatalistToCurrentlyActiveOnTab = (has_tag)=>{
                    let a = d.activeElement
                      , which = has_tag ? (vars.dom_tree.searchTags(a),
                    0) : 1
                      , value = datalists[which].parentNode
                      , style = value.style;

                    !value.classList.contains('show-on-focus') && value.classList.add('show-on-focus')
                    let parent_on_list = objWalk(a, {
                        3: 'parentNode'
                    })
                    datalists.forEach((e,i)=>e.parentNode.classList[i == which ? 'add' : 'remove']('show-on-focus'))
                    let targetIndex = +parent_on_list.getAttribute('index')

                    //54px from 'top', each contenteditable child of each item in the dom tree list is separated vertically by 50px
                    if (targetIndex < 4 && +style.getPropertyValue('--offset').replace(/[a-z]+/, '') !== 44 + targetIndex * 74) {
                        style.setProperty('--offset', 44 + targetIndex * 74 + 'px');
                    }
                }
                , throttleExecution, /*one-time variables  that represent the input fields in the dom walker tooltip */
                DomWalkerResult, DomWalkerToggle, DomStringEval;

                eventOrigin = clicked.nextElementSibling.lastElementChild,
                vars.dom_tree.listsParent ||= eventOrigin.qs('ol'),

                vars.dom_tree.editor.shouldRefreshList;
                vars.dom_tree.editor.refreshList ||= _=>{
                    let children = vars.dom_tree.listsParent.children
                      , index = 0;
                    if (vars.dom_tree.editor.shouldRefreshList) {
                        for (let i = 0, j = children.length; i < j; i++)
                            if (!children[i].classList.contains('ignore'))
                                children[i].setAttribute('index', index++);
                        throttleExecution = elements_updater.get('[refresh-nodes]')();
                    }
                    return children;
                }
                checkbox.checked && (eventType = 'keydown',
                that.vars.dom_tree.editor.insertionDirection ||= 'DOWN'),
                callback = function(e) {
                    !checkbox.checked && cleanUp(()=>'')()
                    let path = e.composedPath()
                      , t = e.target
                      , parent_on_list = objWalk(t, {
                        3: 'parentNode'
                    })
                      , targetIndex = parent_on_list.getAttribute('index')
                      , code = e.code
                      , key = e.key
                      , keyCode = e.keyCode
                      , val = t.textContent
                      , clist = t.classList
                      , prev = t.previousElementSibling
                      , next = t.nextElementSibling;
                    
                    if (!e.altKey && !e.metaKey&&vars.dom_tree.editor.selectedTarget) {
                        //if it is an element in children or childNodes
                        vars.dom_tree.editor.childIndex=void 0;
                        if(targetIndex == void 0) vars.dom_tree.editor.makeChildNodesAccessible=!0;
                        
                        if(vars.dom_tree.editor.makeChildNodesAccessible) vars.dom_tree.editor.childIndex=parent_on_list.getAttribute('child-index');
                            
                        let activeElement;
                        if (!parent_on_list.classList.contains('dom-walker')) {
                            !(async _=>{

                                await vars.dom_tree.editor.promise(_=>t.textContent.trim()).then(text=>{
                                    let a = activeElement = d.activeElement
                                      , tag = a.classList.contains('tag')
                                      , has = tag || a.classList.contains('text')
                                      , string = objWalk(a, {
                                        1: 'parentNode',
                                        2: ['nextElementSibling', 'firstElementChild']
                                    });
                                    if (a.classList.contains('text') && string.textContent === (string = '#text'))
                                        vars.dom_tree.currently_editing_on_page = elements_updater.get('[change-element]')(string + ':' + text, targetIndex)
                                    
                                    if (parent_on_list.tagName === 'LI')
                                        !has && datalists.forEach((e,i)=>e.parentNode.classList.remove('show-on-focus')),
                                        vars.dom_tree.currently_focused !== parent_on_list && (vars.dom_tree.currently_focused = parent_on_list),

                                        keyCode === 13 && (!vars.dom_tree.editor.enterAsNewLine && (t.textContent = text,
                                        vars.dom_tree.editor.shouldRefreshList = !0,
                                        vars.dom_tree.editor.addToListAndPage(vars.dom_tree.editor.cloneNode&&cloneNode(vars.dom_tree.currently_editing_on_page, vars.dom_tree.editor.cloneDeep) )))

                                    //t.textContent=t.textContent.trim() is used to strip the text of the target of \n intrinsically and whitespace openly
                                    if (keyCode === 9 && has)
                                        moveDatalistToCurrentlyActiveOnTab(tag)
                                });

                                code === 'Delete' && targetIndex !== void 0 && parent_on_list.tagName === 'LI' && (parent_on_list.remove(),
                                vars.dom_tree.added_to_editor.delete(parent_on_list))
                            })();

                        } else {
                            !async function() {
                                await vars.dom_tree.editor.promise(_=>parent_on_list.firstElementChild.textContent).then(text=>{
                                    if (text.match(/[a-z]/))
                                        DomStringEval = text.trim().match(/([0-9]+|0)|[A-Za-z]+/g)
                                })
                                
                                let previous, obj = {};
                                DomWalkerToggle ||= objWalk(parent_on_list, ['nextElementSibling', 'lastElementChild', 'firstElementChild']);
                                vars.dom_tree.evaluateDomWalker = function() {

                                    if (DomStringEval && vars.dom_tree.currently_editing_on_page) {
                                            
                                        DomWalkerResult = vars.dom_tree.currently_editing_on_page;
                                        for (let i = 0, j = DomStringEval.length, even; i < j; i++) {
                                            even = i * 2,
                                            obj[DomStringEval[even]] = DomStringEval[even + 1],
                                            DomWalkerResult = objWalk(DomWalkerResult, obj),
                                            obj = {};
                                        }
                                        if (DomWalkerResult.classList) DomWalkerResult.classList[DomWalkerToggle.checked ? 'add' : 'remove']('highlight');
                                        let ln=DomWalkerResult.length;
                                        
                                        objWalk(parent_on_list, {
                                            2: 'nextElementSibling'
                                        }).textContent = DomWalkerResult === vars.dom_tree.currently_editing_on_page ? '[(。﹏。*): found nothing]': (Is(DomWalkerResult)+(ln!=null&&(DomWalkerResult.length?'':' ◁EMPTY▷')||''));
                                    }
                                    return DomWalkerResult
                                }
                                vars.dom_tree.evaluateDomWalker();

                                switch (keyCode) {
                                case 13:
                                    t.textContent = t.textContent.trim(),
                                    t.parentNode.after(previous = vars.dom_tree.editor.domWalkerSpansBank.shift())
                                    break;
                                case 46:
                                    previous = t.parentNode.previousElementSibling
                                    parent_on_list.firstElementChild.children.length !== 1 && t.parentNode.remove()
                                    break;
                                }
                                previous?.firstElementChild.focus();
                            }()
                        }

                        let attr_filter, current, other;
                        if ((attr_filter = (activeElement || t).classList.toString().match(/attribute-[a-z]+/g)) && (vars.dom_tree.currently_editing_on_page.hasAttribute || vars.dom_tree.added_to_editor.get(parent_on_list)?.hasAttribute)) {

                            attr_filter = attr_filter[0].replace('attribute-', '')
                            switch (attr_filter) {
                            case 'name':
                                current = t,
                                other = objWalk(current, ['parentNode', 'nextElementSibling', 'firstElementChild']);
                                let attr, which = vars.dom_tree.added_to_editor.get(parent_on_list) || vars.dom_tree.currently_editing_on_page;

                                setTimeout(arg=>{
                                    if (attr = which.getAttribute(current.innerText))
                                        other.textContent = attr;
                                }
                                , 10)
                                break;
                            case 'value':
                                other = t,
                                current = objWalk(other, ['parentNode', 'previousElementSibling', 'firstElementChild'])
                                break;
                            }
                            if ((vars.dom_tree.editor.enterAsNewLine && keyCode === 13) || (keyCode !== 27 && (key.length === 1 || code === 'Backspace'))) {
                                (vars.dom_tree.added_to_editor.get(parent_on_list) || elements_updater.get('get')(targetIndex)).removeAttribute(current.textContent)
                                setTimeout(arg=>{
                                    current.textContent && (vars.dom_tree.currently_editing_on_page = elements_updater.get('[set-attribute]')({
                                        name: current.textContent,
                                        value: other.innerText.replace(/\n{2}/g, '\n')
                                    }, targetIndex, vars.dom_tree.added_to_editor.get(parent_on_list)))

                                }
                                , 10);
                            } else if (keyCode === 27)
                                setTimeout(_=>current.textContent = other.textContent = '', 10)
                        }

                        switch (clist.contains('text')) {
                        case !0:
                            if (!that.worker.initialized)
                                /*warms up worker*/
                                that.worker(build.css.all_text),
                                that.worker.initialized = true;

                            let string = objWalk(objWalk(t, {
                                2: 'parentNode'
                            }), {
                                2: ['nextElementSibling', 'firstElementChild']
                            }).textContent.trim(), node;

                            if ((node = elements_updater.get('get')(targetIndex)||vars.dom_tree.added_to_editor.get(parent_on_list))?.nodeName.charAt(0) === string.charAt(0)) {
                                setTimeout(_=>node.data = t.innerText.replace(/\n{2}/g, '\n'), 20)
                                //innerText is not as fast as textContent but it considers escape sequences
                            }
                            if (key.length === 1 || code === 'Backspace') {
                                let text;
                                setTimeout(_=>{
                                    text = t.textContent.trim(),
                                    vars.dom_tree.currently_editing_on_page = elements_updater.get('[set-attribute]')({
                                        name: 'class',
                                        value: text
                                    }, targetIndex, vars.dom_tree.added_to_editor.get(parent_on_list)),
				    !text&&(text=vars.dom_tree.currently_editing_on_page).nodeName!=='#text'&&text.removeAttribute('class')
                                }, 20)
                            }

                            if (keyCode === 27) {
                                datalists[1].parentNode.classList.remove('show-on-focus')

                            } else if (string.charAt(0) !=='#'&&!e.shiftKey && (code !== 'Space' && keyCode !== 9) && (key.length === 1 || val && code === 'Backspace')) {
                                for (let j = processed.length; j--; ) {

                                    let current, out, match;
                                    setTimeout(_=>{
                                        if (match = t.textContent.split(' ').pop())
                                            that.worker(j + '|' + match, function(result, keys, values) {
                                                current = build.css[processed[result[1]]],
                                                out = current.nodes[0].qsa('option'),
                                                current.nodes[0].classList[keys.length ? 'add' : 'remove']('loading');
                                                for (let i = 0; i < 4 && (out[i].setAttribute('val', keys.length ? (current.nodes[0].classList.add('loading'),
                                                keys[i] || keys[0]).replace(/^\s+|\s+$/g, '') : (current.nodes[0].classList.remove('loading'),
                                                '[no matched selector]')),
                                                !0); i++);
                                            })
                                    }
                                    , 100)
                                    setTimeout(_=>build.css[processed[j]].nodes[0].classList.remove('loading'), 800)
                                }
                            }
                            break;
                        case !!0:
                            vars.dom_tree.editor.promise(_=>t.textContent).then(text=>{

                                if (clist.contains('tag')) {
                                    if (keyCode === 27) {
                                        datalists[0].parentNode.classList.remove('show-on-focus');
                                    } else if (val.charCodeAt() !== 32 && !e.shiftKey)
                                        vars.dom_tree.searchTags(t)

                                    let string = objWalk(objWalk(t, {
                                        2: ['parentNode', 'previousElementSibling']
                                    }), {
                                        2: 'lastElementChild'
                                    }), query, arr;
                                    string = string.classList.contains('text') ? string.textContent.trim() : '',
                                    /*
						            refresh nodeList before getting nodes below due to promisified context
            					   */
                                    elements_updater.get('[refresh-nodes]')(),
                                    (query = text.trim(),
                                    arr = tagNames.filter(e=>e.startsWith(query)),
                                    keyCode !== 32 && (key.length === 1 || code === 'Backspace')) && (arr.length === 1 && tagNames.indexOf((t.textContent = query = arr[0])) > -1 || tagNames.indexOf(query) > -1) && (vars.dom_tree.currently_editing_on_page = elements_updater.get('[change-element]')(query.charAt(0) === '#' ? query + string : query, targetIndex, vars.dom_tree.added_to_editor.get(parent_on_list)))
                                } else if (clist.contains('size')) {
                                    eventOrigin.children[2].style[prev.textContent] = text + next.textContent
                                }
                            })
                            break;
                        }
                    }
                }
                break;
            case 7:
                clicked.parentNode.parentNode.nextElementSibling.classList.toggle('see-through')
                break;

            case 8:
            case 9:
            case 10:
                if (classList.contains('fa-crosshairs') && vars.dom_tree.currently_editing_on_page && vars.dom_tree.toggle_switch.checked) {
                    let values_array=current=>[current.nodeName.toLowerCase(), objWalk(current, ['classList', 'data']).toString().trim(), current._r('style')('[else]','[finally]').cssText];
                    vars.dom_tree.editor.promise(_=>vars.dom_tree.evaluateDomWalker?.call(null)).then(value=>{
                      if(value) {
                        let spare=build_nodes({
                          name: 'div',
                          innerText: 'added',
                          attributes: {
                            0: {
                              name: 'class',
                              value: 'pointer-events-none absolute bg-yellow-400 text-xs font-sans p-0.5 inline-block top-0 -mt-2.5 right-0 z-10'
                            },
                            length: 1
                          }
                        }), popped_list, next, is=Is(value);
                          
                        if(is==='NodeList'||is==='HTMLCollection') {
                           !async function() {
                              vars.dom_tree.editor.makeChildNodesAccessible=!0;
                              let dump=d.createDocumentFragment(), lists=vars.dom_tree.editor.listBank.splice(-(value.length), value.length), 
                                  frag=d.createDocumentFragment(), children, result, first;
                              spare.textContent=is,
                              vars.dom_tree.editor.childArray=[];
    
                              for(let i=0,len=value.length; i<len; i++) {
                                lists[0].element.appendChild(spare)
                                //sieve out this===tooltip
                                if(value[i] !==tooltip) {
                                  first ||= value[i],
                                  lists[i].element.classList.add('ignore'),
                                  lists[i].element.setAttribute('child-index', i),
                                  await dump.appendChild(value[i].cloneNode(true)), result=values_array(value[i]),
    
                                  children=lists[i].children, 
                                  frag.appendChild(lists[i].element).style.cssText='border-left:4px solid orange;',
                                  children[0].textContent = result[0],
                                  vars.dom_tree.editor.childArray[i]=value[i],
                                      
                                  children[1].textContent = result[1],
                                  children[2].textContent = result[2];
                                  if(children[2].textContent) children[2].parentNode.previousElementSibling.firstElementChild.textContent='style';
                                } else {
                                  vars.dom_tree.editor.listBank.push(lists[i])
                                }
                              }
                              vars.dom_tree.editor.shouldRefreshList = !0,
                              (lists=frag.firstElementChild),
                            
                              dry(dump, frag),
                              lists&&(vars.dom_tree.currently_focused=lists).qs('.text').focus(),
                              vars.dom_tree.currently_editing_on_page=first;
                          }()
                          return vars.dom_tree.editor.promise(_=>vars.dom_tree.editor);
                        }

                        if(is!=='NodeList'&&is!=='HTMLCollection') {
                            let children=(popped_list=vars.dom_tree.editor.listBank.shift()).children, result=values_array(value);
                            popped_list=popped_list.element;
                            //children[0].removeAttribute('contenteditable'),
                            vars.dom_tree.added_to_editor.set(popped_list, value)

                            popped_list.appendChild(spare);
                            children[0].textContent = result[0],
                            children[1].textContent = result[1],
                            children[2].textContent = result[2];
                            if(children[2].textContent) children[2].parentNode.previousElementSibling.firstElementChild.textContent='style'
                            
                            vars.dom_tree.editor.shouldRefreshList = !!0,
                            popped_list.classList.add('ignore'),
                            dry(value, popped_list),
                            children[1].focus();
                            return vars.dom_tree.editor.promise(_=>null)
                        }
                      }
                    }).then(editor=>{
                        if(editor) {
                          editor.shouldRefreshList=true;
                          let elList=editor.refreshList();
                        }
                    });
                    
                    function dry(value, popped_list) {
                      if (vars.dom_tree.currently_focused.parentNode) {
                        vars.dom_tree.currently_focused[that.vars.dom_tree.editor.insertionDirection === 'UP' ? 'before' : 'after'](popped_list);
                        !Is(popped_list, 'DocumentFragment')&&(vars.dom_tree.currently_focused=popped_list, vars.dom_tree.currently_editing_on_page=value)
                      } else {
                          vars.dom_tree.listsParent.appendChild(popped_list)
                          vars.dom_tree.editor.selectedTarget.appendChild(value)
                      }
                    }
                }
                if (clicked.classList.contains('extrapolate-dom') && vars.dom_tree.toggle_switch.checked) {
                    vars.dom_tree.currently_focused ||= vars.dom_tree.editor.refreshList()[0]

                    let targetOnList, textContent, domMethod = prot_H[textContent = clicked.previousElementSibling.textContent.trim()];
                    vars.dom_tree.listsParent.classList.add('custom-cursor', 'highlight-ol'),
                    vars.dom_tree.editor.fireClickAndHighlightOnTarget(function(e) {
                        return relation(vars.dom_tree.listsParent, e.target)[0]
                        //is regarded as a truthy

                    }, vars.dom_tree.listsParent, 'highlight-ol', function(event) {
                        event.preventDefault();
                        let index, child_index, stored, on_list=vars.dom_tree.currently_focused, added;

                        if (targetOnList = slice(event.composedPath(), 0, 4).find(_=>(index=parseInt(_.getAttribute('index')))===index?!0:(child_index=_.getAttribute('child-index'), _.classList.contains('ignore')))) {
                            vars.dom_tree.editor.childIndex=void 0,
                            targetOnList = +index === index ? elements_updater.get('get')(index) : (added=vars.dom_tree.added_to_editor.get(stored=targetOnList))
                                ? added : (vars.dom_tree.editor.childArray[vars.dom_tree.editor.childIndex=child_index]);
                            
                            if (domMethod) {
                                
                                /*
                                  previously:
                                  console.log(domMethod.bind(vars.dom_tree.currently_editing_on_page)(targetOnList))
                                  refactored to what's below because it gave an Illegal Invocation error for text nodes
                                */
                                console.log(vars.dom_tree.currently_editing_on_page[textContent](targetOnList))
                                
                                index = vars.dom_tree.listsParent.children[index]||stored;
                                let isAppending = textContent.match(/prepend|append|appendChild/);
                                isAppending&&isAppending[0]
                                ? index.remove()
                                : (stored||=index)&&/*domMethod.bind(on_list)(stored)*/on_list[textContent](stored);
                                vars.dom_tree.editor.refreshList();
                            } else {
                                /* Formerly this, refractored due to its slowness
                                if (targetOnList.click)
                                    clickAbles[0].click();
                                    //fires event
                                    //receives event, elegant!
                                    targetOnList.click()
                                */
                                //console.log(targetOnList)
                                vars.dom_tree.editor.delegateToAndCreateBindings(targetOnList);
                            }
                        }

                    })
                }
                break;
            }
            switch (_j) {
            case 1:
                let i;
                if (tagNames_target)
                    i = d.createElement('option'),
                    i.setAttribute('data-details', '[description]'),
                    i.setAttribute('val', tagNames_target.textContent),
                    tagNames.push(tagNames_target.innerText),
                    children[0].parentNode.lastElementChild.before(i),
                    children = datalists[0].lastElementChild.children,
                    children[0].parentNode.lastElementChild.classList.remove('opacity-100')
                break;
            case 3:
                vars.dom_tree.editor.enterAsNewLine = pseudo_clicked.firstElementChild.checked
                break
            case 4:
                let replaced;
                vars.dom_tree.editor.promise(_=>replaced = vars.dom_tree.currently_focused).then(text=>{
                    let index, prev_or_next = vars.dom_tree.currently_focused._r('previousElementSibling')('nextElementSibling', vars.dom_tree.currently_focused);
                    elements_updater.get('[remove]')(index = +vars.dom_tree.currently_focused.getAttribute('index'));

                    let other;
                    if (index !== index) {
                        //i.e index=+undefined!==NaN
                        other = [];
                        for (let i of vars.dom_tree.added_to_editor)
                            vars.dom_tree.currently_focused == i[0] ? (vars.dom_tree.currently_editing_on_page = i[1],
                            replaced = i[0]) : other.push(i);
                        let {size: i} = b;
                        other = other[i - 1]
                    }
                    vars.dom_tree.editor.remove([vars.dom_tree.currently_editing_on_page, replaced]);
                    w.requestAnimationFrame(function() {
                        vars.dom_tree.currently_editing_on_page = other ? other[1] : elements_updater.get('get')(index > 0 ? index - 1 : index + 1),
                        vars.dom_tree.currently_focused = prev_or_next;
                        vars.dom_tree.editor.shouldRefreshList = true,
                        vars.dom_tree.editor.refreshList();
                        //elements_updater.get('[refresh-nodes]')()
                    });
                    prev_or_next.qs('.text').focus();
                })
                break;
                case 7:
                    vars.dom_tree.editor.cloneNode = pseudo_clicked.firstElementChild.checked,
                    vars.dom_tree.editor.cloneDeep=(eventOrigin=pseudo_clicked.querySelector('[contenteditable]')).textContent,
                    
                    eventType = 'keydown', callback=function(e) {
                      (vars.dom_tree.editor.cloneDeep = this.textContent)&&(cleanUp(_=>'')())
                    }
                break;
            }
        } else if (vars.dom_tree.editor.selectedTarget && target.hasAttribute('contenteditable') && vars.dom_tree.toggle_switch?.checked) {
            vars.dom_tree.editor.handleClickOnList(target)
        } else {
            let name = path[3].previousElementSibling?.innerHTML;
            if (/\.css/.test(name) && build.css[name]) {
                build.css[name][target.innerText](name)
            }
        }
        eventOrigin && eventOrigin.addEventListener(eventType, callback);
        //cleanUp(); //commented out so as to enable each event response code to implement its cleanUp uniquely.
        //to be called here if currying is to be used on the event callback to facillitate retries.
    }, {
        passive: true,
        bubbles: false,
        capture: false
    })
}

let matchingBrackets = new Map([['{', '}'], ['[', ']'], ['(', ')'], ])
let inverseMatchingBrackets = new Map(Array.from(matchingBrackets.entries()).map(([k,v])=>[v, k]))

let quotes = new Set(['"', "'", '`'])

// Arbitrary values must contain balanced brackets (), [] and {}. Escaped
// values don't count, and brackets inside quotes also don't count.
//
// E.g.: w-[this-is]w-[weird-and-invalid]
// E.g.: w-[this-is\\]w-\\[weird-but-valid]
// E.g.: content-['this-is-also-valid]-weirdly-enough']
function isValidArbitraryValue(value) {
    let stack = []
    let inQuotes = false

    for (let i = 0; i < value.length; i++) {
        let char = value[i]

        if (char === ':' && !inQuotes && stack.length === 0) {
            return false
        }

        // Non-escaped quotes allow us to "allow" anything in between
        if (quotes.has(char) && value[i - 1] !== '\\') {
            inQuotes = !inQuotes
        }

        if (inQuotes)
            continue
        if (value[i - 1] === '\\')
            continue
        // Escaped

        if (matchingBrackets.has(char)) {
            stack.push(char)
        } else if (inverseMatchingBrackets.has(char)) {
            let inverse = inverseMatchingBrackets.get(char)

            // Nothing to pop from, therefore it is unbalanced
            if (stack.length <= 0) {
                return false
            }

            // Popped value must match the inverse value, otherwise it is unbalanced
            if (stack.pop() !== inverse) {
                return false
            }
        }
    }

    // If there is still something on the stack, it is also unbalanced
    if (stack.length > 0) {
        return false
    }

    // All good, totally balanced!
    return true
}
