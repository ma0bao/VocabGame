// SAT vocabulary, each word tied to one root on the skill tree (`r`)
// and broken into parts (`p`, ids from parts.js glossary).
// s = SAT-style sentence with ___ where the word goes.

export const words = [
  // ================= F1 Say & Write =================
  // dict
  { w: 'edict', pos: 'noun', r: 'dict', p: ['ex', 'dict'], d: 'an official order issued by an authority', s: 'The king\'s ___ banned all gatherings after sundown.' },
  { w: 'contradict', pos: 'verb', r: 'dict', p: ['contra', 'dict'], d: 'to assert the opposite of; to deny', s: 'The witness\'s testimony seemed to ___ everything she had said in her written statement.' },
  { w: 'benediction', pos: 'noun', r: 'dict', p: ['ben', 'dict', 'ion'], d: 'a blessing; an expression of good wishes', s: 'The ceremony closed with a brief ___ from the elderly priest.' },
  { w: 'indict', pos: 'verb', r: 'dict', p: ['in2', 'dict'], d: 'to formally accuse of a crime', s: 'The grand jury voted to ___ the executive on three counts of fraud.' },
  { w: 'dictum', pos: 'noun', r: 'dict', p: ['dict', 'um'], d: 'a formal pronouncement or widely held saying', s: 'Her coach\'s favorite ___ was "practice does not make perfect; perfect practice does."' },
  // loqu
  { w: 'eloquent', pos: 'adj', r: 'loqu', p: ['ex', 'loqu', 'ent'], d: 'fluent, forceful, and persuasive in speech', s: 'The senator\'s ___ plea for the bill moved even her opponents.' },
  { w: 'loquacious', pos: 'adj', r: 'loqu', p: ['loqu', 'ous'], d: 'extremely talkative', s: 'My ___ uncle can turn a two-minute phone call into an hour-long saga.' },
  { w: 'colloquial', pos: 'adj', r: 'loqu', p: ['con', 'loqu', 'ial'], d: 'informal; used in everyday conversation', s: 'The essay\'s ___ tone made it feel like a chat rather than a lecture.' },
  { w: 'circumlocution', pos: 'noun', r: 'loqu', p: ['circum', 'loqu', 'ion'], d: 'roundabout, evasive speech; using many words to say little', s: 'Rather than admit the error, the spokesperson buried it in ___.' },
  { w: 'soliloquy', pos: 'noun', r: 'loqu', p: ['sol', 'loqu', 'y'], d: 'a speech in which a character speaks thoughts aloud while alone', s: 'Hamlet\'s most famous ___ begins with "To be, or not to be."' },
  // scrib
  { w: 'proscribe', pos: 'verb', r: 'scrib', p: ['pro', 'scrib'], d: 'to forbid or condemn officially', s: 'The new rules ___ the use of phones during the exam.' },
  { w: 'transcribe', pos: 'verb', r: 'scrib', p: ['trans', 'scrib'], d: 'to write out a copy of spoken or recorded words', s: 'The assistant was asked to ___ the entire two-hour interview.' },
  { w: 'circumscribe', pos: 'verb', r: 'scrib', p: ['circum', 'scrib'], d: 'to restrict within limits; to draw a boundary around', s: 'Strict rules ___ what the intern is allowed to sign.' },
  { w: 'ascribe', pos: 'verb', r: 'scrib', p: ['ad', 'scrib'], d: 'to attribute something to a cause or source', s: 'Historians ___ the empire\'s decline to decades of costly wars.' },
  { w: 'inscription', pos: 'noun', r: 'scrib', p: ['in2', 'scrib', 'ion'], d: 'words written or carved on a surface', s: 'The ___ on the monument had worn away to a few faint letters.' },
  // voc
  { w: 'vociferous', pos: 'adj', r: 'voc', p: ['voc', 'fer', 'ous'], d: 'loud and forceful in expressing opinions', s: 'A ___ crowd of protesters gathered outside the courthouse.' },
  { w: 'equivocal', pos: 'adj', r: 'voc', p: ['equi', 'voc', 'al'], d: 'ambiguous; deliberately unclear', s: 'The candidate\'s ___ answer left reporters unsure where she stood.' },
  { w: 'advocate', pos: 'verb', r: 'voc', p: ['ad', 'voc', 'ate'], d: 'to publicly support or recommend', s: 'Doctors ___ regular exercise for people of all ages.' },
  { w: 'evoke', pos: 'verb', r: 'voc', p: ['ex', 'voc'], d: 'to bring a feeling or memory to mind', s: 'The smell of pine needles never fails to ___ memories of winter camping.' },
  { w: 'irrevocable', pos: 'adj', r: 'voc', p: ['in', 're', 'voc', 'able'], d: 'impossible to take back or undo', s: 'Once the contract is signed, the decision is ___.' },
  // log
  { w: 'eulogy', pos: 'noun', r: 'log', p: ['eu', 'log', 'y'], d: 'a speech praising someone, typically at a funeral', s: 'Her brother delivered a heartfelt ___ that left few dry eyes.' },
  { w: 'analogous', pos: 'adj', r: 'log', p: ['ana', 'log', 'ous'], d: 'comparable in certain respects; similar', s: 'The heart\'s role in the body is ___ to a pump\'s role in a fountain.' },
  { w: 'neologism', pos: 'noun', r: 'log', p: ['neo', 'log', 'ism'], d: 'a newly coined word or expression', s: '"Doomscrolling" is a ___ that entered dictionaries within a few years.' },
  { w: 'epilogue', pos: 'noun', r: 'log', p: ['epi', 'log'], d: 'a concluding section at the end of a book or play', s: 'The ___ revealed what happened to the characters ten years later.' },
  { w: 'dialogue', pos: 'noun', r: 'log', p: ['dia', 'log'], d: 'a conversation between two or more people', s: 'The mediator encouraged open ___ between the two sides.' },

  // ================= F2 Go & Move =================
  // duc
  { w: 'induce', pos: 'verb', r: 'duc', p: ['in2', 'duc'], d: 'to bring about or persuade', s: 'Nothing could ___ him to give up his Saturday morning routine.' },
  { w: 'conducive', pos: 'adj', r: 'duc', p: ['con', 'duc', 'ive'], d: 'making a certain outcome likely; helpful', s: 'A quiet, well-lit room is ___ to focused studying.' },
  { w: 'deduce', pos: 'verb', r: 'duc', p: ['de', 'duc'], d: 'to reach a conclusion by reasoning from evidence', s: 'From the muddy footprints, the detective could ___ that the visitor had come through the garden.' },
  { w: 'abduct', pos: 'verb', r: 'duc', p: ['ab', 'duc'], d: 'to take someone away by force', s: 'The film\'s plot centers on a plan to ___ a diplomat\'s daughter.' },
  { w: 'seduce', pos: 'verb', r: 'duc', p: ['se', 'duc'], d: 'to lure or tempt into a course of action', s: 'Flashy ads ___ shoppers into buying things they never needed.' },
  // mit
  { w: 'intermittent', pos: 'adj', r: 'mit', p: ['inter', 'mit', 'ent'], d: 'stopping and starting at intervals', s: 'The ___ rain made it hard to decide whether to cancel the picnic.' },
  { w: 'remiss', pos: 'adj', r: 'mit', p: ['re', 'mit'], d: 'negligent; careless about duty', s: 'I would be ___ if I did not thank the volunteers who made this possible.' },
  { w: 'emissary', pos: 'noun', r: 'mit', p: ['ex', 'mit', 'ary'], d: 'a person sent as a representative or messenger', s: 'The queen dispatched an ___ to negotiate the treaty.' },
  { w: 'omit', pos: 'verb', r: 'mit', p: ['ob', 'mit'], d: 'to leave out', s: 'Please do not ___ your middle initial on the form.' },
  { w: 'submissive', pos: 'adj', r: 'mit', p: ['sub', 'mit', 'ive'], d: 'meekly obedient; yielding to others', s: 'The once-defiant puppy grew ___ after a week of training.' },
  // ced
  { w: 'precede', pos: 'verb', r: 'ced', p: ['pre', 'ced'], d: 'to come before in time or order', s: 'A brief overture will ___ the first act.' },
  { w: 'recede', pos: 'verb', r: 'ced', p: ['re', 'ced'], d: 'to move back or withdraw', s: 'As the floodwaters began to ___, residents returned to survey the damage.' },
  { w: 'concede', pos: 'verb', r: 'ced', p: ['con', 'ced'], d: 'to admit something is true after first denying it; to yield', s: 'After the recount, the mayor was forced to ___ the election.' },
  { w: 'antecedent', pos: 'noun', r: 'ced', p: ['ante', 'ced', 'ent'], d: 'something that comes before and leads to something else', s: 'The telegraph was an important ___ of the modern internet.' },
  { w: 'secede', pos: 'verb', r: 'ced', p: ['se', 'ced'], d: 'to formally withdraw from a group or organization', s: 'Several provinces threatened to ___ if the tax passed.' },
  // vert
  { w: 'avert', pos: 'verb', r: 'vert', p: ['ab', 'vert'], d: 'to turn away; to prevent', s: 'Quick thinking by the pilot helped ___ a disaster.' },
  { w: 'subvert', pos: 'verb', r: 'vert', p: ['sub', 'vert'], d: 'to undermine the power or authority of', s: 'The rebels sought to ___ the government from within.' },
  { w: 'aversion', pos: 'noun', r: 'vert', p: ['ab', 'vert', 'ion'], d: 'a strong dislike', s: 'His ___ to public speaking kept him from running for office.' },
  { w: 'diverse', pos: 'adj', r: 'vert', p: ['dis', 'vert'], d: 'showing a great deal of variety', s: 'The city is home to a ___ mix of cultures and cuisines.' },
  { w: 'introvert', pos: 'noun', r: 'vert', p: ['intro', 'vert'], d: 'a person who is quiet and inwardly focused', s: 'As an ___, she found the crowded party exhausting rather than fun.' },
  // gress
  { w: 'digress', pos: 'verb', r: 'gress', p: ['dis', 'gress'], d: 'to stray from the main topic', s: 'The professor tends to ___ into stories about his college days.' },
  { w: 'transgress', pos: 'verb', r: 'gress', p: ['trans', 'gress'], d: 'to violate a law or moral rule', s: 'Those who ___ the honor code face suspension.' },
  { w: 'regress', pos: 'verb', r: 'gress', p: ['re', 'gress'], d: 'to return to a worse or earlier state', s: 'Without practice, your skills will ___ over the summer.' },
  { w: 'egress', pos: 'noun', r: 'gress', p: ['ex', 'gress'], d: 'an exit; the act of going out', s: 'Fire codes require a clear ___ from every floor.' },
  { w: 'gradual', pos: 'adj', r: 'gress', p: ['gress', 'al'], d: 'happening slowly, step by step', s: 'The ___ warming of the lake went unnoticed until the fish vanished.' },

  // ================= F3 Feel & Know =================
  // path
  { w: 'apathy', pos: 'noun', r: 'path', p: ['a', 'path', 'y'], d: 'lack of interest or concern', s: 'Voter ___ was blamed for the record-low turnout.' },
  { w: 'empathy', pos: 'noun', r: 'path', p: ['in2', 'path', 'y'], d: 'the ability to understand and share another\'s feelings', s: 'Nurses need ___ as much as technical skill.' },
  { w: 'antipathy', pos: 'noun', r: 'path', p: ['anti', 'path', 'y'], d: 'a deep-seated dislike', s: 'The two rivals made no effort to hide their mutual ___.' },
  { w: 'pathos', pos: 'noun', r: 'path', p: ['path'], d: 'a quality that evokes pity or sadness', s: 'The final scene is full of ___ as the old dog waits by the door.' },
  { w: 'sympathetic', pos: 'adj', r: 'path', p: ['syn', 'path', 'ic'], d: 'feeling or showing compassion', s: 'A ___ teacher gave him an extra day to finish the essay.' },
  // sent
  { w: 'sentiment', pos: 'noun', r: 'sent', p: ['sent', 'ment'], d: 'a feeling or attitude; an opinion', s: 'Public ___ turned against the project after the cost doubled.' },
  { w: 'dissent', pos: 'verb', r: 'sent', p: ['dis', 'sent'], d: 'to disagree with an official or majority view', s: 'Two justices chose to ___ from the court\'s ruling.' },
  { w: 'assent', pos: 'noun', r: 'sent', p: ['ad', 'sent'], d: 'agreement or approval', s: 'The plan cannot go forward without the board\'s ___.' },
  { w: 'sentient', pos: 'adj', r: 'sent', p: ['sent', 'ent'], d: 'able to perceive or feel things', s: 'The novel imagines a ___ ocean that responds to human thought.' },
  { w: 'presentiment', pos: 'noun', r: 'sent', p: ['pre', 'sent', 'ment'], d: 'a feeling that something is about to happen', s: 'She had a ___ of trouble long before the phone rang.' },
  // cred
  { w: 'credible', pos: 'adj', r: 'cred', p: ['cred', 'able'], d: 'believable; convincing', s: 'The jury found the alibi ___ and voted to acquit.' },
  { w: 'incredulous', pos: 'adj', r: 'cred', p: ['in', 'cred', 'ous'], d: 'unwilling or unable to believe', s: 'The ___ crowd stared as the magician floated three feet off the ground.' },
  { w: 'credence', pos: 'noun', r: 'cred', p: ['cred', 'ance'], d: 'belief in or acceptance of something as true', s: 'The new evidence lent ___ to the theory.' },
  { w: 'credulous', pos: 'adj', r: 'cred', p: ['cred', 'ous'], d: 'too ready to believe things; gullible', s: '___ investors poured money into the scheme without asking questions.' },
  { w: 'discredit', pos: 'verb', r: 'cred', p: ['dis', 'cred'], d: 'to harm the reputation of; to cause to be doubted', s: 'The leaked emails threatened to ___ the entire study.' },
  // sci
  { w: 'omniscient', pos: 'adj', r: 'sci', p: ['omni', 'sci', 'ent'], d: 'knowing everything', s: 'The novel is told by an ___ narrator who sees into every character\'s mind.' },
  { w: 'conscientious', pos: 'adj', r: 'sci', p: ['con', 'sci', 'ous'], d: 'careful, diligent, and guided by a sense of duty', s: 'A ___ editor checks every citation twice.' },
  { w: 'prescient', pos: 'adj', r: 'sci', p: ['pre', 'sci', 'ent'], d: 'having knowledge of events before they happen', s: 'Her ___ warning about the housing market went ignored.' },
  { w: 'unconscionable', pos: 'adj', r: 'sci', p: ['con', 'sci', 'able'], d: 'not right or reasonable; shockingly unfair', s: 'Charging triple prices during the storm was ___.' },
  // cogn
  { w: 'cognizant', pos: 'adj', r: 'cogn', p: ['cogn', 'ent'], d: 'aware; having knowledge of', s: 'The captain was fully ___ of the risks before setting sail.' },
  { w: 'incognito', pos: 'adj', r: 'cogn', p: ['in', 'cogn'], d: 'with one\'s identity concealed', s: 'The celebrity traveled ___, wearing a cap and sunglasses.' },
  { w: 'recognize', pos: 'verb', r: 'cogn', p: ['re', 'cogn', 'ize'], d: 'to identify from previous knowledge; to acknowledge', s: 'It took a moment to ___ my old teacher without her glasses.' },
  { w: 'agnostic', pos: 'noun', r: 'cogn', p: ['a', 'cogn', 'ic'], d: 'a person who believes nothing can be known for certain about a question', s: 'On the question of life on other planets, he remains an ___.' },
  { w: 'diagnosis', pos: 'noun', r: 'cogn', p: ['dia', 'cogn'], d: 'the identification of a problem by examining its signs', s: 'The mechanic\'s ___ was a cracked radiator hose.' },

  // ================= F4 Big & Small =================
  // magn
  { w: 'magnanimous', pos: 'adj', r: 'magn', p: ['magn', 'anim', 'ous'], d: 'generous and forgiving, especially toward a rival', s: 'The champion was ___ in victory, praising her opponent\'s effort.' },
  { w: 'magnitude', pos: 'noun', r: 'magn', p: ['magn', 'tud'], d: 'great size, extent, or importance', s: 'Few grasped the ___ of the problem until the report came out.' },
  { w: 'magnate', pos: 'noun', r: 'magn', p: ['magn', 'ate'], d: 'a wealthy and influential business leader', s: 'The shipping ___ donated a new wing to the hospital.' },
  { w: 'magnify', pos: 'verb', r: 'magn', p: ['magn', 'ify'], d: 'to make something appear larger or more important', s: 'Social media can ___ a small mistake into a scandal.' },
  // min
  { w: 'diminish', pos: 'verb', r: 'min', p: ['de', 'min', 'ish'], d: 'to make or become smaller or less', s: 'The setback did nothing to ___ her enthusiasm.' },
  { w: 'minuscule', pos: 'adj', r: 'min', p: ['min', 'ule'], d: 'extremely small', s: 'The chance of rain was ___, so we left the umbrellas at home.' },
  { w: 'minute', pos: 'adj', r: 'min', p: ['min', 'ute'], d: 'extremely small; precise in detail', s: 'The jeweler inspected the gem for ___ flaws.' },
  { w: 'minimize', pos: 'verb', r: 'min', p: ['min', 'ize'], d: 'to reduce to the smallest possible amount', s: 'Wearing a helmet helps ___ the risk of head injury.' },
  // omni
  { w: 'omnipotent', pos: 'adj', r: 'omni', p: ['omni', 'pot', 'ent'], d: 'having unlimited power', s: 'In the myth, the ___ god reshapes the mountains with a word.' },
  { w: 'omnivorous', pos: 'adj', r: 'omni', p: ['omni', 'vor', 'ous'], d: 'eating both plants and animals; taking in everything', s: 'Bears are ___, feasting on berries and salmon alike.' },
  { w: 'omnipresent', pos: 'adj', r: 'omni', p: ['omni', 'pre', 'sent'], d: 'present everywhere at once', s: 'Advertising has become ___, appearing even on gas pump screens.' },
  // pan
  { w: 'panacea', pos: 'noun', r: 'pan', p: ['pan', 'ac'], d: 'a supposed cure for all problems', s: 'Technology is no ___ for the challenges of teaching.' },
  { w: 'panoramic', pos: 'adj', r: 'pan', p: ['pan', 'hor', 'ic'], d: 'showing a wide, unbroken view', s: 'The tower offers a ___ view of the entire valley.' },
  { w: 'pandemic', pos: 'noun', r: 'pan', p: ['pan', 'dem', 'ic'], d: 'a disease outbreak spread across a whole region or the world', s: 'Schools shifted online during the ___.' },
  { w: 'pantheon', pos: 'noun', r: 'pan', p: ['pan', 'theo'], d: 'all the gods of a people; a group of celebrated figures', s: 'She has earned a place in the ___ of great American poets.' },
  // mult
  { w: 'multifarious', pos: 'adj', r: 'mult', p: ['mult', 'far', 'ous'], d: 'having many varied parts or aspects', s: 'The festival\'s ___ events ranged from poetry slams to robot battles.' },
  { w: 'multitude', pos: 'noun', r: 'mult', p: ['mult', 'tud'], d: 'a very large number of people or things', s: 'A ___ of fans crowded the square for the parade.' },
  { w: 'multilingual', pos: 'adj', r: 'mult', p: ['mult', 'ling', 'al'], d: 'speaking or using several languages', s: 'The ___ guide switched effortlessly between French, Arabic, and English.' },

  // ================= F5 Time & Order =================
  // chron
  { w: 'chronic', pos: 'adj', r: 'chron', p: ['chron', 'ic'], d: 'persisting for a long time or constantly recurring', s: 'His ___ lateness finally cost him the job.' },
  { w: 'anachronism', pos: 'noun', r: 'chron', p: ['ana', 'chron', 'ism'], d: 'something out of its proper time period', s: 'A wristwatch on a Roman soldier is an obvious ___ in the film.' },
  { w: 'chronological', pos: 'adj', r: 'chron', p: ['chron', 'log', 'ic', 'al'], d: 'arranged in order of time', s: 'Arrange the events in ___ order before writing your summary.' },
  { w: 'synchronous', pos: 'adj', r: 'chron', p: ['syn', 'chron', 'ous'], d: 'happening at the same time', s: 'The dancers\' ___ movements looked like a single body in motion.' },
  { w: 'chronicle', pos: 'noun', r: 'chron', p: ['chron', 'ic'], d: 'a factual written account of events in order', s: 'The diary is a vivid ___ of life during the siege.' },
  // temp
  { w: 'temporal', pos: 'adj', r: 'temp', p: ['temp', 'al'], d: 'relating to time; worldly rather than spiritual', s: 'The exhibit is arranged along a ___ line from 1900 to today.' },
  { w: 'contemporary', pos: 'adj', r: 'temp', p: ['con', 'temp', 'ary'], d: 'belonging to the same time; modern', s: 'Jane Austen was a ___ of Beethoven, though they never met.' },
  { w: 'extemporaneous', pos: 'adj', r: 'temp', p: ['ex', 'temp', 'ous'], d: 'spoken or done without preparation', s: 'Her ___ remarks were more moving than the prepared speech.' },
  { w: 'temporize', pos: 'verb', r: 'temp', p: ['temp', 'ize'], d: 'to delay making a decision in order to gain time', s: 'The general chose to ___, hoping reinforcements would arrive.' },
  { w: 'temporary', pos: 'adj', r: 'temp', p: ['temp', 'ary'], d: 'lasting for only a limited time', s: 'The bridge closure is ___ and should end by spring.' },
  // ante
  { w: 'antebellum', pos: 'adj', r: 'ante', p: ['ante', 'bell', 'um'], d: 'occurring before a war, especially the American Civil War', s: 'The ___ mansion still stands on the edge of town.' },
  { w: 'antedate', pos: 'verb', r: 'ante', p: ['ante', 'dat'], d: 'to come before in time', s: 'These cave paintings ___ the invention of writing by thousands of years.' },
  { w: 'anterior', pos: 'adj', r: 'ante', p: ['ante', 'or'], d: 'nearer the front; earlier', s: 'The ___ wall of the fort faced the river.' },
  { w: 'antechamber', pos: 'noun', r: 'ante', p: ['ante', 'cham'], d: 'a small room leading to a main room', s: 'Guests waited in the ___ until the ambassador was ready.' },
  // post
  { w: 'posthumous', pos: 'adj', r: 'post', p: ['post', 'hum', 'ous'], d: 'occurring after a person\'s death', s: 'The poet\'s ___ collection became her best-selling book.' },
  { w: 'posterity', pos: 'noun', r: 'post', p: ['post', 'ity'], d: 'all future generations', s: 'The founders sealed the time capsule for ___.' },
  { w: 'postpone', pos: 'verb', r: 'post', p: ['post', 'pon'], d: 'to put off to a later time', s: 'Rain forced officials to ___ the championship game.' },
  { w: 'posterior', pos: 'adj', r: 'post', p: ['post', 'or'], d: 'situated behind or later', s: 'The ___ fins of the fish help it steer.' },
  // nov
  { w: 'novice', pos: 'noun', r: 'nov', p: ['nov', 'ice'], d: 'a beginner', s: 'Even a ___ can learn the basic chords in an afternoon.' },
  { w: 'innovative', pos: 'adj', r: 'nov', p: ['in2', 'nov', 'ive'], d: 'introducing new ideas or methods', s: 'The ___ design uses sunlight to purify water.' },
  { w: 'renovate', pos: 'verb', r: 'nov', p: ['re', 'nov', 'ate'], d: 'to restore to good condition; to make new again', s: 'The city plans to ___ the old train station into a market.' },
  { w: 'novelty', pos: 'noun', r: 'nov', p: ['nov', 'ity'], d: 'the quality of being new or unusual', s: 'The ___ of the gadget wore off after a week.' },

  // ================= F6 Rule & People =================
  // arch
  { w: 'anarchy', pos: 'noun', r: 'arch', p: ['a', 'arch', 'y'], d: 'absence of government; disorder', s: 'With the police on strike, the city teetered on the edge of ___.' },
  { w: 'hierarchy', pos: 'noun', r: 'arch', p: ['hier', 'arch', 'y'], d: 'a system that ranks people or things one above another', s: 'In the company\'s strict ___, interns rarely speak to executives.' },
  { w: 'oligarchy', pos: 'noun', r: 'arch', p: ['olig', 'arch', 'y'], d: 'government by a small group of people', s: 'Critics say the nation has become an ___ run by a few billionaires.' },
  { w: 'monarch', pos: 'noun', r: 'arch', p: ['mono', 'arch'], d: 'a king, queen, or other sole ruler', s: 'The ___ waved to the crowd from the palace balcony.' },
  { w: 'matriarch', pos: 'noun', r: 'arch', p: ['matr', 'arch'], d: 'a woman who heads a family or group', s: 'Grandma Rosa, the family ___, made every major decision.' },
  // crat
  { w: 'autocrat', pos: 'noun', r: 'crat', p: ['auto', 'crat'], d: 'a ruler with absolute power', s: 'The ___ silenced the press and jailed his critics.' },
  { w: 'bureaucracy', pos: 'noun', r: 'crat', p: ['bureau', 'crat', 'y'], d: 'a system of government with complex rules and many officials', s: 'Getting the permit meant wading through months of ___.' },
  { w: 'aristocracy', pos: 'noun', r: 'crat', p: ['aristo', 'crat', 'y'], d: 'the highest social class; nobility', s: 'Members of the ___ owned most of the land.' },
  { w: 'plutocracy', pos: 'noun', r: 'crat', p: ['pluto', 'crat', 'y'], d: 'government by the wealthy', s: 'When only the rich can afford to run, democracy drifts toward ___.' },
  { w: 'technocrat', pos: 'noun', r: 'crat', p: ['techn', 'crat'], d: 'an expert who wields power because of technical knowledge', s: 'The new minister is a ___ with a background in engineering rather than politics.' },
  // dem
  { w: 'demographic', pos: 'noun', r: 'dem', p: ['dem', 'graph', 'ic'], d: 'a particular section of a population', s: 'The show is popular with the teenage ___.' },
  { w: 'demagogue', pos: 'noun', r: 'dem', p: ['dem', 'agog'], d: 'a leader who gains power by stirring up emotions and prejudice', s: 'The ___ blamed immigrants for every problem in the province.' },
  { w: 'epidemic', pos: 'noun', r: 'dem', p: ['epi', 'dem', 'ic'], d: 'a widespread occurrence of a disease or problem', s: 'Health officials warned of a flu ___ this winter.' },
  { w: 'democratize', pos: 'verb', r: 'dem', p: ['dem', 'crat', 'ize'], d: 'to make accessible to everyone', s: 'Cheap smartphones helped ___ access to the internet.' },
  // anthrop
  { w: 'misanthrope', pos: 'noun', r: 'anthrop', p: ['mis', 'anthrop'], d: 'a person who dislikes humankind', s: 'The ___ in the novel lives alone on a cliff and shouts at hikers.' },
  { w: 'anthropology', pos: 'noun', r: 'anthrop', p: ['anthrop', 'ology'], d: 'the study of human societies and cultures', s: 'Her ___ fieldwork took her to a remote village in Peru.' },
  { w: 'philanthropist', pos: 'noun', r: 'anthrop', p: ['phil', 'anthrop', 'ist'], d: 'a person who donates money to good causes', s: 'The ___ funded scholarships for hundreds of students.' },
  { w: 'anthropomorphic', pos: 'adj', r: 'anthrop', p: ['anthrop', 'morph', 'ic'], d: 'giving human traits to animals or objects', s: 'The cartoon\'s ___ cars have eyes and grin at one another.' },
  // gen
  { w: 'genesis', pos: 'noun', r: 'gen', p: ['gen'], d: 'the origin or beginning of something', s: 'The ___ of the club was a late-night argument about chess.' },
  { w: 'progeny', pos: 'noun', r: 'gen', p: ['pro', 'gen', 'y'], d: 'offspring; descendants', s: 'The champion racehorse\'s ___ sold for record prices.' },
  { w: 'indigenous', pos: 'adj', r: 'gen', p: ['in2', 'gen', 'ous'], d: 'originating naturally in a particular place', s: 'The park protects plants ___ to the region.' },
  { w: 'genre', pos: 'noun', r: 'gen', p: ['gen'], d: 'a category of art or literature with shared features', s: 'Science fiction is her favorite ___.' },
  { w: 'heterogeneous', pos: 'adj', r: 'gen', p: ['hetero', 'gen', 'ous'], d: 'made up of different kinds; varied', s: 'The ___ crowd included farmers, bankers, and students.' },

  // ================= F7 Good & Bad =================
  // ben
  { w: 'benevolent', pos: 'adj', r: 'ben', p: ['ben', 'vol', 'ent'], d: 'well-meaning and kindly', s: 'A ___ stranger paid for the family\'s groceries.' },
  { w: 'benefactor', pos: 'noun', r: 'ben', p: ['ben', 'fact', 'or'], d: 'a person who gives money or help', s: 'An anonymous ___ covered the cost of the new library.' },
  { w: 'benign', pos: 'adj', r: 'ben', p: ['ben', 'gen'], d: 'gentle and harmless', s: 'The tumor turned out to be ___, to everyone\'s relief.' },
  { w: 'beneficial', pos: 'adj', r: 'ben', p: ['ben', 'fic', 'ial'], d: 'producing good results; helpful', s: 'Moderate exercise is ___ to both body and mood.' },
  // mal
  { w: 'malevolent', pos: 'adj', r: 'mal', p: ['mal', 'vol', 'ent'], d: 'wishing evil or harm to others', s: 'The villain\'s ___ grin told the audience what was coming.' },
  { w: 'malicious', pos: 'adj', r: 'mal', p: ['mal', 'ous'], d: 'intending to do harm', s: 'The ___ rumor spread through the school in a single day.' },
  { w: 'malady', pos: 'noun', r: 'mal', p: ['mal', 'y'], d: 'a disease or ailment', s: 'Doctors could not name the mysterious ___ sweeping the village.' },
  { w: 'malign', pos: 'verb', r: 'mal', p: ['mal', 'gen'], d: 'to speak harmful untruths about', s: 'The article seemed designed to ___ the mayor rather than inform readers.' },
  { w: 'malaise', pos: 'noun', r: 'mal', p: ['mal', 'ease'], d: 'a general feeling of discomfort or unease', s: 'A sense of ___ hung over the office after the layoffs.' },
  // eu
  { w: 'euphemism', pos: 'noun', r: 'eu', p: ['eu', 'phem', 'ism'], d: 'a mild word used in place of a harsh one', s: '"Passed away" is a common ___ for "died."' },
  { w: 'euphoria', pos: 'noun', r: 'eu', p: ['eu', 'phor', 'ia'], d: 'a feeling of intense happiness', s: 'The team\'s ___ after the win lasted all week.' },
  { w: 'euphonious', pos: 'adj', r: 'eu', p: ['eu', 'phon', 'ous'], d: 'pleasing to the ear', s: 'The poet chose ___ words that flowed like a song.' },
  { w: 'eulogize', pos: 'verb', r: 'eu', p: ['eu', 'log', 'ize'], d: 'to praise highly in speech or writing', s: 'Colleagues gathered to ___ the retiring coach.' },
  // dys
  { w: 'dystopia', pos: 'noun', r: 'dys', p: ['dys', 'top', 'ia'], d: 'an imagined society of great suffering and injustice', s: 'The novel depicts a ___ where books are outlawed.' },
  { w: 'dysfunctional', pos: 'adj', r: 'dys', p: ['dys', 'func', 'ion', 'al'], d: 'not operating normally or properly', s: 'The ___ committee argued for hours and decided nothing.' },
  { w: 'dyslexia', pos: 'noun', r: 'dys', p: ['dys', 'lex', 'ia'], d: 'a learning difference that affects reading', s: 'With the right support, students with ___ thrive in school.' },
  // phil
  { w: 'philanthropy', pos: 'noun', r: 'phil', p: ['phil', 'anthrop', 'y'], d: 'the desire to promote the welfare of others, especially by donating', s: 'Her ___ built schools in three countries.' },
  { w: 'bibliophile', pos: 'noun', r: 'phil', p: ['biblio', 'phil'], d: 'a person who loves books', s: 'A true ___, he owns more books than he could read in a lifetime.' },
  { w: 'philosophy', pos: 'noun', r: 'phil', p: ['phil', 'soph', 'y'], d: 'the study of fundamental questions about knowledge and existence', s: 'Her ___ class debated whether free will exists.' },
  { w: 'audiophile', pos: 'noun', r: 'phil', p: ['audi', 'phil'], d: 'a person passionate about high-quality sound', s: 'The ___ spent more on speakers than on his car.' },

  // ================= F8 Around & Beyond =================
  // circum
  { w: 'circumvent', pos: 'verb', r: 'circum', p: ['circum', 'ven'], d: 'to find a way around an obstacle or rule', s: 'Students tried to ___ the filter by using a different browser.' },
  { w: 'circumspect', pos: 'adj', r: 'circum', p: ['circum', 'spec'], d: 'cautious; considering all consequences', s: 'Be ___ about what you post online.' },
  { w: 'circumference', pos: 'noun', r: 'circum', p: ['circum', 'fer', 'ance'], d: 'the boundary line around a circle', s: 'The trail follows the ___ of the lake.' },
  { w: 'circuitous', pos: 'adj', r: 'circum', p: ['circum', 'ire', 'ous'], d: 'roundabout; not direct', s: 'The bus took a ___ route through every neighborhood in town.' },
  // sub
  { w: 'subordinate', pos: 'adj', r: 'sub', p: ['sub', 'ord', 'ate'], d: 'lower in rank or importance', s: 'The manager expected ___ staff to follow orders without question.' },
  { w: 'subterfuge', pos: 'noun', r: 'sub', p: ['sub', 'terfug'], d: 'deceit used to achieve a goal', s: 'The spy used ___ to slip past the guards.' },
  { w: 'subdue', pos: 'verb', r: 'sub', p: ['sub', 'duc'], d: 'to overcome or bring under control', s: 'It took three officers to ___ the escaped bull.' },
  { w: 'subtle', pos: 'adj', r: 'sub', p: ['sub', 'tel'], d: 'so delicate or precise as to be hard to notice', s: 'The ___ shift in her tone told me she was upset.' },
  { w: 'subsequent', pos: 'adj', r: 'sub', p: ['sub', 'sequ', 'ent'], d: 'coming after something in time', s: '___ tests confirmed the original result.' },
  // super
  { w: 'superfluous', pos: 'adj', r: 'super', p: ['super', 'flu', 'ous'], d: 'more than is needed; unnecessary', s: 'The editor cut every ___ adjective from the manuscript.' },
  { w: 'supersede', pos: 'verb', r: 'super', p: ['super', 'sed'], d: 'to take the place of; to replace', s: 'The new safety rules ___ all earlier guidelines.' },
  { w: 'superficial', pos: 'adj', r: 'super', p: ['super', 'fic', 'ial'], d: 'on the surface only; shallow', s: 'The scratch was ___ and healed in two days.' },
  { w: 'surmount', pos: 'verb', r: 'super', p: ['super', 'mount'], d: 'to overcome a difficulty', s: 'She had to ___ years of self-doubt to finish the marathon.' },
  { w: 'surpass', pos: 'verb', r: 'super', p: ['super', 'pass'], d: 'to exceed; to be greater than', s: 'Ticket sales this year will ___ last year\'s record.' },
  // trans
  { w: 'transient', pos: 'adj', r: 'trans', p: ['trans', 'ire', 'ent'], d: 'lasting only a short time; passing through', s: 'The ___ fame of the viral video faded within a month.' },
  { w: 'transcend', pos: 'verb', r: 'trans', p: ['trans', 'scend'], d: 'to go beyond the limits of', s: 'Great music can ___ language and culture.' },
  { w: 'translucent', pos: 'adj', r: 'trans', p: ['trans', 'luc', 'ent'], d: 'allowing light to pass through but not detailed images', s: 'The ___ curtains softened the harsh afternoon sun.' },
  { w: 'transitory', pos: 'adj', r: 'trans', p: ['trans', 'ire', 'ory'], d: 'not permanent; brief', s: 'Fame in the fashion world is often ___.' },
  { w: 'transgression', pos: 'noun', r: 'trans', p: ['trans', 'gress', 'ion'], d: 'an act that breaks a law or rule', s: 'A minor ___ like forgetting a permission slip should not mean detention.' },
  // ex
  { w: 'exonerate', pos: 'verb', r: 'ex', p: ['ex', 'oner', 'ate'], d: 'to clear of blame', s: 'New DNA evidence helped ___ the man after twelve years in prison.' },
  { w: 'exorbitant', pos: 'adj', r: 'ex', p: ['ex', 'orb', 'ent'], d: 'unreasonably high in price or amount', s: 'The airport café charged an ___ nine dollars for a bottle of water.' },
  { w: 'expunge', pos: 'verb', r: 'ex', p: ['ex', 'pung'], d: 'to erase or remove completely', s: 'The judge agreed to ___ the record after the charges were dropped.' },
  { w: 'extricate', pos: 'verb', r: 'ex', p: ['ex', 'tric', 'ate'], d: 'to free from a difficult situation', s: 'It took an hour to ___ the kitten from the engine compartment.' },
  { w: 'exuberant', pos: 'adj', r: 'ex', p: ['ex', 'uber', 'ent'], d: 'full of energy and excitement', s: 'The ___ puppy knocked over two lamps in its first hour home.' },
];
