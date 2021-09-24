---
title: Chrome DevTools
date: '2021-09-07 18:30:00'
tags: 
- Summary

category: Development
image: 
---

## Elements

### CSS

## Console

console既属于Panel工具也是Drawer级工具，使用ESC可以在其他devtools界面打开console；

### Log Messages

```js
// Info
console.log('Hello, Console!');

// Warn
console.warn('Abandon Hope All Ye Who Enter');

// Error
console.error(`I'm sorry, Dave. I'm afraid I can't do that.`);

// Table
console.table([
    {
      first: 'René',
      last: 'Magritte',
    },
    {
      first: 'Chaim',
      last: 'Soutine',
      birthday: '18930113',
    },
    {
      first: 'Henri',
      last: 'Matisse',
    }
]);

// Group
const label = 'Adolescent Irradiated Espionage Tortoises';
console.group(label);
console.info('Leo');
console.info('Mike');
console.info('Don');
console.info('Raph');
console.groupEnd(label);

// Custom style
const spacing = '5px';
const styles = `padding: ${spacing}; background-color: darkblue; color: white; font-style: italic; border: ${spacing} solid crimson; font-size: 2em;`;
console.log('%cVariety is the spice of life', styles);
```

### Run Javascript
- View and change the page's JavaScript or DOM
- Run arbitrary JavaScript that's not related to the page

### Console API

```js
// Writes an error to the console when expression evaluates to false.
console.assert(expression, object)
// Clears the console.
console.clear()
// Writes the number of times that count() has been invoked at the same line and with the same label.
console.count([label])
// Resets a count.
console.countReset([label])
// Identical to console.log(object [, object, ...]) except different log level.
console.debug(object [, object, ...])
// Prints a JSON representation of the specified object.
console.dir(object)
// Prints an XML representation of the descendants of node.
console.dirxml(node)
// Starts a new timer. Call console.timeEnd([label]) to stop the timer and print the elapsed time to the Console.
console.time([label])
console.timeEnd([label])
// Prints a stack trace to the Console.
console.trace()
```

### Console Utilities API
只用于在chrome devtools console中使用的集成方法，在脚本中添加无效；

- \$\_: $_ returns the value of the most recently evaluated expression.
- \$0-\$4: The \$0, \$1, \$2, \$3 and \$4 commands work as a historical reference to the last five DOM elements inspected within the Elements panel or the last five JavaScript heap objects selected in the Profiles panel. \$0 returns the most recently selected element or JavaScript object, \$1 returns the second most recently selected one, and so on.
- \$(selector, [startNode]): $(selector) returns the reference to the first DOM element with the specified CSS selector.
- \$$(selector, [startNode]): \$\$(selector) returns an array of elements that match the given CSS selector. This command is equivalent to calling document.querySelectorAll().
- \$x(path, [startNode]): \$x(path) returns an array of DOM elements that match the given XPath expression.
- clear()
- copy(object): copies a string representation of the specified object to the clipboard.
- dir(object): displays an object-style listing of all the specified object's properties. This method is an alias for the Console API's console.dir() method.
- inspect(object/function): opens and selects the specified element or object in the appropriate panel: either the Elements panel for DOM elements or the Profiles panel for JavaScript heap objects.
- getEventListeners(object): returns the event listeners registered on the specified object. The return value is an object that contains an array for each registered event type (click or keydown, for example).
- monitor(function) / unmonitor(function): When the function specified is called, a message is logged to the console that indicates the function name along with the arguments that are passed to the function when it was called.
- monitorEvents(object[, events]): When one of the specified events occurs on the specified object, the Event object is logged to the console. You can specify a single event to monitor, an array of events, or one of the generic events "types" mapped to a predefined collection of events. 
- profile(): starts a JavaScript CPU profiling session with an optional name. profileEnd() completes the profile and displays the results in the Profile panel.
- queryObjects(Constructor): Call queryObjects(Constructor) from the console to return an array of objects that were created with the specified constructor. 
- table(data[, columns])

## Network

## Performance
