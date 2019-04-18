import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Editor, EditorState, ContentState, CompositeDecorator, convertToRaw } from 'draft-js';
import { debounce } from 'lodash';

import 'draft-js/dist/Draft.css';
import './DocEditor.scss';

import { updatingEditor } from '../redux/actions';

// https://reactrocket.com/post/draft-js-search-and-replace/

// const findWithRegex = (regex, contentBlock, callback) => {
//   const text = contentBlock.getText();
//   let matchArr, start, end;
//   while ((matchArr = regex.exec(text)) !== null) {
//     start = matchArr.index;
//     end = start + matchArr[0].length;
//     callback(start, end);
//   }
// };

// const generateDecorator = (highlightTerm, component) => {
//   const regex = new RegExp(highlightTerm, 'g');
//   return new CompositeDecorator([{
//     strategy: (contentBlock, callback) => {
//       console.log('generateDecorator', contentBlock.getText());
//       if (highlightTerm !== '') {
//         findWithRegex(regex, contentBlock, callback);
//       }
//     }, component
//   }])
// };

function findWithRegex(regex, contentBlock, callback) {
  const text = contentBlock.getText();
  let matchArr, start;
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
}

const CommentSpan = (props) => {
  return <span style={styles.comment}>{props.children}</span>;
};

const OperatorSpan = (props) => {
  return <span style={styles.operator}>{props.children}</span>;
};

const NumberSpan = (props) => {
  return <span style={styles.number}>{props.children}</span>;
};

const FunctionSpan = (props) => {
  return <span style={styles.func}>{props.children}</span>;
};

const VariableSpan = (props) => {
  return <span style={styles.var}>{props.children}</span>;
};

const UnitSpan = (props) => {
  return <span style={styles.unit}>{props.children}</span>;
};

const SabotageSpan = (props) => {
  return <span style={styles.sabotage}>{props.children}</span>;
};

const COMMENT_REGEX = /^\s*\/\/.*$/g;
const OPERATOR_REGEX = /\b([\*/\+=%-]|off|of|on|as|to)\b/g;
const NUM_REGEX = /[\$-]?[\d.]+%?/g;
const FUNC_REGEX = /\b(min|max|sum|avg|count|round|rounddown|roundup|sin|cos|tan)/gi;
const VAR_REGEX = /^[a-z0-9_-]+ /gi;

// const UNIT_REGEX = /\b(ft|feet|in|inches|m|meters|km|kilometers)/gi;
const UNIT_REGEX = /\b(googol|zetta|zepto|yotta|yocto|milli|micro|hecto|femto|centi|Zetta|Zepto|Yotta|Yocto|Milli|Micro|Hecto|Femto|Centi|zebi|yobi|tera|tebi|pico|peta|pebi|nano|mega|mebi|kilo|kibi|giga|gibi|exbi|deka|deci|deca|atto|Zebi|Yobi|Tera|Tebi|Pico|Peta|Pebi|Nano|Mega|Mebi|Kibi|Giga|Gibi|Exbi|Deci|Deca|Atto|exa|Exa|mc|da|Zi|Yi|Ti|Pi|Mi|Ki|Gi|Ei|µ|z|y|u|p|n|m|k|h|f|d|c|a|Z|Y|T|P|M|G|E|1)??(standard-gravitation|astronomical-unit|light-second|light-minute|fluid-ounces|tablespoons|survey-foot|pound-force|naut-league|fluid-ounce|atmospheres|tablespoon|steradians|short-tons|pound-mass|nucleotide|metric-ton|light-year|horsepower|fortnights|fahrenheit|centigrade|becquerels|atmosphere|teaspoons|steradian|short-ton|red-shift|naut-mile|molecules|kilograms|fortnight|centuries|boardfoot|boardfeet|becquerel|base-pair|angstroms|teaspoon|sieverts|rotation|roentgen|redshift|poundals|oersteds|nleagues|molecule|maxwells|kilogram|furlongs|decibels|coulombs|calories|angstrom|Calories|sievert|siemens|seconds|rankine|radians|poundal|percent|pascals|parsecs|oersted|nleague|newtons|minutes|maxwell|leagues|henries|hectare|grammes|gradian|gallons|furlong|fathoms|enzUnit|degrees|decibel|decades|daltons|coulomb|century|celsius|candela|calorie|amperes|Calorie|webers|therms|teslas|stokes|second|radian|quarts|pounds|points|pixels|pascal|parsec|ounces|newton|minute|metres|meters|litres|liters|league|kelvin|joules|inches|gramme|gallon|fathom|farads|dollar|degree|decade|dalton|curies|carats|ampere|years|yards|weeks|weber|watts|volts|units|tonne|therm|tesla|tempR|tempK|tempF|tempC|stone|slugs|sfoot|sfeet|quart|pound|poise|point|pixel|pints|picas|ounce|molar|miles|metre|meter|lumen|litre|liter|knots|katal|joule|inh2o|inH2O|hours|hertz|henry|gross|grays|grams|grads|gauss|farad|dozen|curie|count|cmh2o|cmH2O|cents|cells|carat|bytes|annum|acres|Therm|year|yard|week|watt|volt|unit|torr|tons|tbsp|sqin|sqft|slug|rods|pint|pica|ohms|mole|mmHg|mils|mile|lsec|lmin|knot|inch|inHg|inAq|hour|gray|gram|grad|foot|floz|feet|ergs|each|dyne|dots|degR|degK|degF|degC|days|cups|cmAq|cell|byte|btus|bdft|bars|amps|acre|Watt|Torr|CFPM|Btus|tsp|ton|thm|tbs|sft|sec|rpm|rod|rad|psi|ppm|ppi|ppb|pdl|ohm|nmi|mph|mol|min|mil|lux|lbs|lbm|lbf|kts|kph|kat|hrs|gon|gee|gal|fur|fps|fbm|erg|dyn|dpm|dpi|doz|dot|deg|day|cup|cpm|cfm|cal|btu|bpm|bit|bar|atm|ang|amu|amp|USD|Ohm|Cal|CFM|Btu|ATM|AMU|yr|yd|wk|tn|st|sr|rd|qt|px|pt|pc|oz|nt|mi|ly|ls|lm|lb|kt|kn|kg|hr|hp|gr|ft|dz|dB|cu|ct|cd|bp|bf|Wb|Sv|St|Pa|Oe|NM|Mx|Hz|Gy|Da|Ci|Bq|AU|z|y|u|s|m|l|h|g|d|b|W|V|U|T|S|R|P|N|M|L|J|H|G|F|C|B|A|'|%|#|")\b/g

const SABOTAGE_REGEX = /\bsabotage\b/gi;

// const styleColors = {
//   comment: 'gray',
//   operator: 'lightblue',
//   number: 'green', 
//   func: 'violet',
//   var: 'orange',
//   unit:'blue'
// }

const styles = {
  comment: {color: 'hsla(0, 0%, 58%, 1)'},
  operator: {color: '#001f3f'},
  number: {color: '#0074D9'}, 
  func: {color: '#FF851B'},
  var: {color: '#3D9970'},
  unit: {color: '#B10DC9'},
  sabotage: {
    color: '#FF4136',
    "font-weight": 'bold',
    "text-shadow": '1px 1px 3px #F012BE'
  }
}

function commentStrategy(contentBlock, callback, contentState) {
  findWithRegex(COMMENT_REGEX, contentBlock, callback);
}

function operatorStrategy(contentBlock, callback, contentState) {
  findWithRegex(OPERATOR_REGEX, contentBlock, callback);
}

function numberStrategy(contentBlock, callback, contentState) {
  findWithRegex(NUM_REGEX, contentBlock, callback);
}

function funcStrategy(contentBlock, callback, contentState) {
  findWithRegex(FUNC_REGEX, contentBlock, callback);
}

function varStrategy(contentBlock, callback, contentState) {
  findWithRegex(VAR_REGEX, contentBlock, callback);
}

function unitStrategy(contentBlock, callback, contentState) {
  findWithRegex(UNIT_REGEX, contentBlock, callback);
}

function sabotageStrategy(contentBlock, callback, contentState) {
  findWithRegex(SABOTAGE_REGEX, contentBlock, callback);
}

const compositeDecorator = new CompositeDecorator([
  {
    strategy: numberStrategy,
    component: NumberSpan,
  },
  {
    strategy: commentStrategy,
    component: CommentSpan,
  },
  {
    strategy: operatorStrategy,
    component: OperatorSpan,
  },
  {
    strategy: funcStrategy,
    component: FunctionSpan,
  },
  {
    strategy: varStrategy,
    component: VariableSpan,
  },
  {
    strategy: unitStrategy,
    component: UnitSpan,
  },
  {
    strategy: sabotageStrategy,
    component: SabotageSpan,
  },
]);

// const findCommentEntities = (contentState, contentBlock, callback) => {
//   console.log('findCommentEntities', contentBlock);
//   contentBlock.findEntityRanges(
//     (character) => {
//       const entityKey = character.getEntity();
//       return (
//         entityKey !== null &&
//         contentState.getEntity(entityKey).getType() === 'COMMENT'
//       );
//     }, callback);
// };

// const commentDecorator = generateDecorator('^//');

// const decorators = new CompositeDecorator([
//   {
//     strategy: findCommentEntities,
//     component: CommentEntity,
//   }
// ])

class DocEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputState: EditorState.createEmpty(compositeDecorator)
    };
  }

  // lines = () => this.props.doc.lines;
  // contents = () => this.props.doc.contents;
  // results = () => this.lines().map(l => l.result_formatted);

  // contentText = () => this.contents().join('\n');
  // resultText = () => this.results().join('\n');

  // editorContent = () => this.state.inputState.getCurrentContent();
  // editorText = () => this.editorContent().getPlainText('\n');
  // editorLines = () => this.editorText().split('\n');

  handleChange = (editorState) => {
    if (this.state.inputState !== editorState) {
      this.setState({
        inputState: EditorState.set(editorState, 
          {decorator: compositeDecorator})
      });

      this.handleContentChange(editorState);
      // const rawContent = convertToRaw(editorState.getCurrentContent());
      // this.props.updateContent(this.props.doc, rawContent);
    }
  }

  handleContentChange = debounce((editorState) => {
    const rawContent = convertToRaw(editorState.getCurrentContent());
    console.log('handleContentChange', rawContent);
    this.props.updateContent(this.props.doc, rawContent);
  }, 1);

  render() {
     return (
      <div className="editor-container doc-editor-container">
        <div className="doc-editor input-editor">
          <Editor onChange={this.handleChange}
            editorState={EditorState.acceptSelection(this.props.inputState, this.state.inputState.getSelection())}
            stripPastedStyles={true} />
        </div>
        <div className="doc-editor result-editor">
          <Editor editorState={this.props.resultState} 
            readOnly={true} />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    doc: state.document,
    inputState: EditorState.set(state.editor.inputState, {decorator: compositeDecorator}),
    resultState: state.editor.resultState,
    rawContent: state.editor.rawContent
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateContent: (doc, content) => {
      // console.log('updateContent', content);
      dispatch(updatingEditor(doc, content))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DocEditor);