import blessed from 'blessed';

const screen = blessed.screen({
  smartCSR: true,
});

screen.title = 'skype-node demo';

const textbox = blessed.textbox({
  top: 'center',
  height: '50',
  width: '100%',
  style: {
    fg: 'white',
    bg: 'magenta',
    border: {
      fg: '#f0f0f0',
    },
    hover: {
      bg: 'green',
    },
  },
});
screen.append(textbox);
// textbox.readInput((result) => {
//   console.log(result);
// });

// const box = blessed.box({
//   top: 'center',
//   left: 'center',
//   width: '50%',
//   height: '50%',
//   content: 'Hello {bold}world{/bold}!',
//   tags: true,
//   border: {
//     type: 'line',
//   },
//   style: {
//     fg: 'white',
//     bg: 'magenta',
//     border: {
//       fg: '#f0f0f0',
//     },
//     hover: {
//       bg: 'green',
//     },
//   },
// });
// screen.append(box);


screen.key(['escape', 'q', 'C-c'], (ch, key) => {
  return process.exit(0);
});


textbox.focus();
screen.render();
