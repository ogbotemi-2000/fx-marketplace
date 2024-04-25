/*
let arr=[], match ='bagrd', incr=0; 'backgroundeb'.replace(/b|a|r|g|d/g, function(e, i){
    if((incr<match.length)&&match[incr]==e) arr[incr++]=i;
    return `<strong>${e}</strong>`
})
*/

/*very fast and efficient algorithm for tokenizing any part of a css stylesheet*/
function restruct(str, input, callbacks, interval, fast, trimmed={}, i, len, selectors=[], comments=[], indexes=[], matched=[], result, rgx='', lngst='', seeAhead) {
  if(input&&(input=(input.__proto__===Array.prototype?input:[input]).filter(e=>e)).length) {
    result = restruct.result ||= {},
    lngst = input[input.length-1],
    i = restruct.index||=0;
    
    // will be available behind a flag input = reUnique(input);
    //restruct.input = reUnique(restruct.input.concat(input));
    for(let prop, decr=input.length, j; decr--;) {
      j=input[decr], (result[j] ||= (restruct.index = i = 0, {matched:[], selectors:[], indexes:[]}));
      if(!(result[j]&&result[j].loopedThrough)) (rgx||=[]).push(j), j.length>lngst.length&&(lngst=j);
    }
    rgx &&= new RegExp('('+rgx.join('|')+')'),
    seeAhead = (offset, added='') => {
      for(let i=offset; i<offset+lngst.length; i++) {
        added += str[i]
      }
      return added
    };
     //input = Object.keys(result); will be set behind a flag for viewing cached items
    /* once below importantant in making the for loop below loop once every restruct() */
    let once = 1, end_cb =id=>(input.forEach((e, res)=>{
            (res = result[e])&&(res.loopedThrough=!0);
            if(!res.matched.length) {
              delete res
            }
          }), cAF(id), clearInterval(id), restruct.index = i, callbacks&&typeof callbacks['end']==='function'&&callbacks['end'](i, result, input), 0);
    
    for(let offset_index=0, count=0, keep=[], sel_str, at_rules=[], except_len, at_len=0, watch=0, index = 0, at_rule_index, out_at_rule=true, in_at_rule=[], nests=0, ahead, in_scope, push = 4, temp, res, j=len||str.length; state = (once||(fast&&i<j))||fast&&end_cb();) {
        once = 0,
        (restruct.clear||=_=>{cAF(restruct.id), cAF(rAF.interval), clearInterval(rAF.interval)})(),
        restruct.__loop = id => {
          // restruct.index = i = restruct.increase++; //needed to make i not exceed j when boosting, by storing in globally
          if(!(i<j)) end_cb(id);
          restruct.id = id,
          callbacks&&typeof callbacks['progress']==='function'&&callbacks['progress'](i, result, input);
          /** in_scope lets the concerned loops work only within '{' '}', this is required for when selector names are 
             similar to whatever string is being tested as a property name.
             -------------
             the if statement below is separated from the rest so as to not affect the cascade.
             It works by 'keep'ing the value of i where it points to '{' in str.
             the kept values are then accessed later in order to store the selectors with matched
             property names.
             Accessing it later is possible by starting from keep[keep.length-1]
             and checking str[--_i] until either a '}' or '*\/' is encountered.
             Since it is backwards, the strings encountered are stored in an array which is then reversed and joined
          */
         if((res=str[i])==='{') ++nests, keep.push(i), in_scope=true;
          if(res&&res.trim()) { /* removing whitspace does not affect the algorithm */
            if(res+str[i+1]==='/*') {
              /* will be improved in order to make comments existing in selector style declarations seen as opposed to browsers not "seeing" them */
              /**
               * i<j in the loop conditions below is very important for preventing
               * freezing when the loops' conditions are not met
               * _____________________________
               * There will be a flag to determine whether unclosed comments should
               * be closed by the matching algorithm in the loop below
               */
              for(let _val='', val='', curr; !(curr+_val==='*/')&&i<j||(comments[comments.length]=res+val+_val, ++i, 0); val+=(curr=str[++i])||'', _val=str[i+1]||'');
            } else {
              if(res==='@') at_rules.push(i);
              ahead = seeAhead(i)/* Array.from({length:2}).map((e, _i)=>str[i+_i]).join('') */;
              
              if(in_scope&&(rgx&&rgx.test(ahead)/*==='back'/*||(res+str[i+1]==='--', ahead.replace(rgx, _1=>restruct.matched=_1)) */)) {
                ahead.replace(rgx, (a, obj)=>{
                  if((obj = result[a])&&!obj.loopedThrough) matched = obj.matched, selectors = obj.selectors, indexes = obj.indexes
                });
                for(let _val='', val=''; i<j;) {
                  if(!/;|\}/.test(_val)) {
                    val+=str[++i], _val=str[i+1]
                  } else {
                    index++,
                    matched.push(res+val);
                    let data_uri='';
                    for(val=0; val<6; data_uri+=str[2+i+val++]);
                    if(data_uri==='base64') for(_i=i+val+1, val=''; _i<j&&(!/;|\}/.test(str[_i+1])||(matched[matched.length-1]+=_val+data_uri+val, i=_i+1, 0)); val+=str[++_i]);
                    break;
                  }
                }
                /**
                 * at_len-1<=at_rules.length&&(at_len=len) in the falsy part of the for loop condition below
                 * ensures that at_len updates its value to len once for each increase of at_rules.length.
                 * The dynamic values of at_len is used further down below as an index in "selectors" that points to 
                 * either an @-rule or its first-matched selector string in order to know @-rules
                 * that failed to have their very first selector styles declaration block matching the checked 
                 * properties. Thus requiring that the selector styles declaration blocks in the said @-rules
                 * are properly marked by their enclosing @-rule
                 * _______________________
                 * This persistence is needed so as to add the matching @-rule for selectors that
                 * aren't the first matched in a given @-rule
                 * the loop below loops backwards in order to store matched selector strings
                 */
                for(let _i=keep[keep.length-1], __i=0, len=selectors.length, vals=[]; ((!/\}/.test(str[_i-1])&&!/\/\*/.test(str[_i-1]+str[_i-2]))&&_i>0)||(at_len-1<=at_rules.length&&(at_len=len), /^[^]*@/.test(vals)&&(except_len=len), (selectors[len?len-1:len]!==(vals=vals.reverse().join(''))/*||indexes[indexes.length-1]+1===index-1*/)&&(nests===2?at_rule_index=len:out_at_rule=true, selectors[len]=vals), 0); vals[__i++]=str[--_i]);
              } else if(res==='}') {
                /**
                 * the condition below provides a window to get all @-rules in the CSS
                 * nests gets incremented and decremented at res = {||} respectively.
                 * It can only be equal to |2| if the loop encounters } or { twice and due to the 
                 * enclosing res==='}' condition, it is a '}' twice.
                 */
                if(nests===2&&(temp=selectors.length)) {
                  /**It is imperative that the condition below ensures that only nesting @-rules are considered:
                   * An update may involve considering nesting in .scss, .less files
                  */
                  let close_brace;
                  if(close_brace=/^[^]*@/.test(selectors[temp-1])) /*selectors[temp-1] references an @-rule*/;
                  /** For @-rules that do not have the styles in their first style block matching the conditions in
                   *  this loop, the for loop below loops backward from a hitherto stored index till either
                   *  an '@' or ultimately *\/ or } is encountered.
                   */
                  /**
                   * [USEFUL]: keep[watch-1] if not undefined always returns an index that points to the open curly braces
                   * for an @-rule's first selector style declaration block if the @-rule begins
                   * the stylesheet otherwise it points to both of them consecutively.
                   * While keep[watch+1] points to the first selector style
                   * declaration block of the said @-rule that has matched property-values.
                   * ______________________________
                   * keep[watch-1]'s value is the index of the '{' that
                   * generally begins an @-rule declaration.
                   * keep[watch+1] is used because its value points to the index of
                   * the first matched selector string in the said @-rule
                   * ________________________
                   * The condition below is to check against already sorted @-rules
                   */
                  // console.log('::[KEEP]::', at_rules[at_rules.length-1], at_len, keep[watch-1], selectors[at_len])
                  /**
                   * at_len is an index to get selector strings with matching property-values in an @-rule that does
                   * not have its very first selector string block having matching property-values.
                   * _______________________________
                   * There are situations where at_len points to a string that is 
                   * already in an @-rule in selectors, since at_len always is the index of the
                   * first selector style block with matching property-values, at_len -1 will therefore
                   * point to the @-rule itself or some other selector string.
                   * except_len equals the length of selectors whenever its last element matches
                   * an @-rule.
                   * _____________________________________
                   * The above check won't catch at_len values that point to selector strings deep within an @-rule. However,
                   * by counting the number of open curly braces encountered on the way, the valid values of at_len are
                   * known using the value of open_curlys in the condition of the for loop below.
                   */
                  /*
                  PS: the algorithm sort of forced my hand at this point: I did not want the containing @-rule: media query, keyframes
                  to start every matched selector that doesn't begin it.
                  It is possible but requires some tweaks - using the out_at_rule variable as a condition in the control statement below to get started for one, besides, leaving it as is makes the output more readable.
                  */
                  else if(at_rule_index&&(sel_str=selectors[at_rule_index])&&!/\}|\{/g.test(sel_str)&&at_rules[at_rules.length-1]<keep[watch+1]) for(let vals='', open_curlys=0, val, kept=keep[watch+1], at_rule=at_rules[at_rules.length-1]-1; at_rule<kept&&((val=str[++at_rule])==='{'&&++open_curlys)!==1||(close_brace=true, selectors[at_rule_index]=vals+val+sel_str, out_at_rule=0); vals+=val);
                  /**
                   * the line of code below stores booleans of matches against an @-rule and, its result
                   * is used to further below add a '}' to delimit the last matched selector string in the @-rule.
                   * This makes it convenient to know where an @-rule starts and ends in the grand scheme of things.
                   */
                  close_brace&&(in_at_rule[count++]=close_brace)
                }
                /**
                 * the condition below provides a window to obtain the very last selector declaration
                 * in an @-rule. To know where an @-rule ends, a '}' is added to the 
                 * very last selector string in the @-rule by the code below for later reference.
                 * in_scope ensures that the loop does this outside any context of a selector i.e. the last
                 * two curly braces in the @-rule.
                 */
      
                /**
                 * nests === keep.length - watch. However, the performance loss in accessing keep['length']
                 * prevented using the above surrogate.
                 * in_at_rule[count-1] stores true/false which are flags for whether the last element in 
                 * selectors is the last matched selector string in a given @-rule
                 * ____________________________________________
                 * nests===1 is true when the enclosing condition: res==='}' or '{' is true,
                 * in this case, at the last curly brace of an @-rule. Thus making 
                 * selectors[temp-1] = The last matched selctor string in an @-rule
                 * 
                 */
                !in_scope&&nests===1&&(temp=selectors.length)&&(in_at_rule[count-1])&&(selectors[temp-1]+=res),
                --nests,
                ++watch,
                in_scope = false,
                /* a way to keep indices for separating matched property-values of selector styles */
                /* reduce indexes by extras from previous index*/
                matched[indexes.length]&&indexes.push(index/*-offset_index*/),
                offset_index = index;
              }
            }
          }
          if(i === j-1) console.log(comments); /* very last */
          /* increment operation below is brought here so as to make indexes be in sync with elements they point to */
          i = restruct.index++; //needed to make i not exceed j when boosting, by storing in globally
        },
        fast&&restruct.__loop(),
        !fast&&rAF(restruct.__loop, true)
    }
  }
}