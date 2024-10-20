export const runtimes = {
  bun: 'bun',
  deno: 'deno',
  node: 'node',
  hermes: 'hermes',
  workerd: 'workerd',
  browser: 'browser',
}

export const emptyFunction = Object.freeze(() => {})

export const tatamiNgGroup = '$tatami-ng_group'

/**
 * Student t-distribution two-tailed critical values for 95% confidence level.
 */
export const tTable = Object.freeze({
  1: 12.706204736432102,
  2: 4.3026527299112765,
  3: 3.182446305284264,
  4: 2.7764451051977996,
  5: 2.57058183661474,
  6: 2.446911848791681,
  7: 2.3646242510102997,
  8: 2.306004135033371,
  9: 2.262157162740992,
  10: 2.2281388519649385,
  11: 2.200985160082949,
  12: 2.178812829663418,
  13: 2.160368656461013,
  14: 2.1447866879169277,
  15: 2.131449545559323,
  16: 2.1199052992210112,
  17: 2.109815577833181,
  18: 2.10092204024096,
  19: 2.0930240544082634,
  20: 2.085963447265837,
  21: 2.0796138447276626,
  22: 2.073873067904015,
  23: 2.068657610419041,
  24: 2.063898561628021,
  25: 2.0595385527532946,
  26: 2.0555294386428713,
  27: 2.0518305164802837,
  28: 2.048407141795244,
  29: 2.0452296421327034,
  30: 2.042272456301238,
  31: 2.0395134463964077,
  32: 2.0369333434601016,
  33: 2.0345152974493383,
  34: 2.0322445093177186,
  35: 2.030107928250343,
  36: 2.0280940009804507,
  37: 2.0261924630291097,
  38: 2.0243941645751367,
  39: 2.0226909117347285,
  40: 2.021075382995338,
  41: 2.019540963982894,
  42: 2.0180816970958815,
  43: 2.0166921941428138,
  44: 2.0153675699129416,
  45: 2.0141033848332928,
  46: 2.012895595294589,
  47: 2.011740510475755,
  48: 2.010634754696446,
  49: 2.0095752344892093,
  50: 2.0085591097152062,
  51: 2.0075837681558824,
  52: 2.0066468031022118,
  53: 2.00574599353695,
  54: 2.0048792865665233,
  55: 2.0040447818101814,
  56: 2.003240717496698,
  57: 2.002465458054599,
  58: 2.0017174830120927,
  59: 2.0009953770482105,
  60: 2.000297821058262,
  61: 1.9996235841149783,
  62: 1.9989715162223116,
  63: 1.998340541772196,
  64: 1.9977296536259739,
  65: 1.9971379077520126,
  66: 1.9965644183594748,
  67: 1.996008353475506,
  68: 1.9954689309194023,
  69: 1.994945414632814,
  70: 1.9944371113297732,
  71: 1.9939433674345044,
  72: 1.9934635662785831,
  73: 1.9929971255321668,
  74: 1.9925434948468204,
  75: 1.9921021536898658,
  76: 1.9916726093523491,
  77: 1.9912543951146042,
  78: 1.9908470685550523,
  79: 1.9904502099893606,
  80: 1.9900634210283845,
  81: 1.9896863232444832,
  82: 1.989318556936819,
  83: 1.9889597799871794,
  84: 1.9886096667986737,
  85: 1.988267907310378,
  86: 1.9879342060816723,
  87: 1.9876082814405773,
  88: 1.987289864690939,
  89: 1.9869786993737681,
  90: 1.9866745405784685,
  91: 1.9863771543000652,
  92: 1.9860863168388938,
  93: 1.985801814239503,
  94: 1.9855234417658303,
  95: 1.9852510034099267,
  96: 1.9849843114317696,
  97: 1.9847231859278835,
  98: 1.9844674544266925,
  99: 1.9842169515086832,
  100: 1.983971518449634,
  101: 1.9837310028852815,
  102: 1.9834952584959407,
  103: 1.9832641447097104,
  104: 1.9830375264229902,
  105: 1.9828152737371547,
  106: 1.9825972617102912,
  107: 1.9823833701230178,
  108: 1.9821734832574516,
  109: 1.9819674896884745,
  110: 1.9817652820865104,
  111: 1.981566757031071,
  112: 1.9813718148344008,
  113: 1.9811803593745805,
  114: 1.9809922979375068,
  115: 1.9808075410672004,
  116: 1.980626002423938,
  117: 1.9804475986497296,
  118: 1.9802722492407063,
  119: 1.9800998764260065,
  120: 1.979930405052777,
  121: 1.9797637624769306,
  122: 1.9795998784593314,
  123: 1.97943868506709,
  124: 1.979280116579683,
  125: 1.9791241093996175,
  126: 1.9789706019673938,
  127: 1.978819534680521,
  128: 1.9786708498163625,
  129: 1.9785244914586055,
  130: 1.9783804054271532,
  131: 1.9782385392112587,
  132: 1.9780988419057237,
  133: 1.977961264150002,
  134: 1.9778257580700531,
  135: 1.9776922772228045,
  136: 1.9775607765430836,
  137: 1.977431212292894,
  138: 1.9773035420129166,
  139: 1.9771777244761224,
  140: 1.9770537196433886,
  141: 1.9769314886210223,
  142: 1.97681099362009,
  143: 1.9766921979174685,
  144: 1.9765750658185368,
  145: 1.9764595626214163,
  146: 1.9763456545827007,
  147: 1.9762333088845883,
  148: 1.9761224936033637,
  149: 1.9760131776791554,
  150: 1.9759053308869141,
  151: 1.9757989238085507,
  152: 1.975693927806187,
  153: 1.9755903149964589,
  154: 1.9754880582258323,
  155: 1.9753871310468787,
  156: 1.9752875076954728,
  157: 1.9751891630688665,
  158: 1.9750920727046015,
  159: 1.9749962127602256,
  160: 1.9749015599937723,
  161: 1.9748080917449764,
  162: 1.9747157859171882,
  163: 1.9746246209599583,
  164: 1.9745345758522659,
  165: 1.9744456300863593,
  166: 1.9743577636521858,
  167: 1.9742709570223849,
  168: 1.974185191137821,
  169: 1.9741004473936339,
  170: 1.9740167076257829,
  171: 1.9739339540980692,
  172: 1.9738521694896138,
  173: 1.9737713368827694,
  174: 1.9736914397514562,
  175: 1.9736124619498976,
  176: 1.9735343877017435,
  177: 1.9734572015895646,
  178: 1.9733808885447033,
  179: 1.9733054338374667,
  180: 1.973230823067649,
  181: 1.9731570421553692,
  182: 1.9730840773322162,
  183: 1.9730119151326795,
  184: 1.9729405423858692,
  185: 1.9728699462074992,
  186: 1.9728001139921352,
  187: 1.9727310334056907,
  188: 1.9726626923781656,
  189: 1.9725950790966158,
  190: 1.9725281819983451,
  191: 1.972461989764315,
  192: 1.9723964913127596,
  193: 1.9723316757930012,
  194: 1.9722675325794565,
  195: 1.972204051265833,
  196: 1.9721412216594971,
  197: 1.9720790337760221,
  198: 1.972017477833896,
  199: 1.9719565442493954,
  200: 1.9718962236316093,
  201: 1.9718365067776158,
  202: 1.971777384667801,
  203: 1.971718848461318,
  204: 1.9716608894916787,
  205: 1.971603499262479,
  206: 1.9715466694432433,
  207: 1.9714903918653972,
  208: 1.9714346585183509,
  209: 1.9713794615456992,
  210: 1.9713247932415296,
  211: 1.9712706460468354,
  212: 1.9712170125460335,
  213: 1.9711638854635767,
  214: 1.971111257660664,
  215: 1.9710591221320446,
  216: 1.9710074720029072,
  217: 1.97095630052586,
  218: 1.9709056010779908,
  219: 1.9708553671580111,
  220: 1.9708055923834753,
  221: 1.970756270488079,
  222: 1.9707073953190282,
  223: 1.9706589608344816,
  224: 1.9706109611010594,
  225: 1.9705633902914228,
  226: 1.9705162426819125,
  227: 1.9704695126502556,
  228: 1.9704231946733297,
  229: 1.9703772833249869,
  230: 1.9703317732739336,
  231: 1.9702866592816697,
  232: 1.9702419362004757,
  233: 1.9701975989714555,
  234: 1.9701536426226303,
  235: 1.9701100622670775,
  236: 1.9700668531011214,
  237: 1.9700240104025675,
  238: 1.9699815295289818,
  239: 1.969939405916016,
  240: 1.9698976350757686,
  241: 1.9698562125951948,
  242: 1.9698151341345516,
  243: 1.9697743954258797,
  244: 1.9697339922715287,
  245: 1.9696939205427133,
  246: 1.9696541761781068,
  247: 1.9696147551824699,
  248: 1.9695756536253115,
  249: 1.9695368676395828,
  250: 1.9694983934204007,
  251: 1.9694602272238055,
  252: 1.9694223653655467,
  253: 1.969384804219895,
  254: 1.9693475402184863,
  255: 1.9693105698491933,
  256: 1.9692738896550193,
  257: 1.9692374962330224,
  258: 1.9692013862332616,
  259: 1.9691655563577715,
  260: 1.9691300033595551,
  261: 1.9690947240416052,
  262: 1.9690597152559448,
  263: 1.9690249739026924,
  264: 1.9689904969291443,
  265: 1.968956281328883,
  266: 1.9689223241409022,
  267: 1.9688886224487527,
  268: 1.9688551733797075,
  269: 1.968821974103945,
  270: 1.9687890218337525,
  271: 1.968756313822743,
  272: 1.968723847365097,
  273: 1.9686916197948103,
  274: 1.9686596284849691,
  275: 1.9686278708470335,
  276: 1.9685963443301415,
  277: 1.968565046420423,
  278: 1.9685339746403347,
  279: 1.9685031265480044,
  280: 1.9684724997365923,
  281: 1.968442091833664,
  282: 1.968411900500579,
  283: 1.9683819234318907,
  284: 1.9683521583547587,
  285: 1.9683226030283762,
  286: 1.9682932552434063,
  287: 1.968264112821431,
  288: 1.9682351736144144,
  289: 1.9682064355041722,
  290: 1.968177896401857,
  291: 1.968149554247451,
  292: 1.9681214070092705,
  293: 1.9680934526834821,
  294: 1.9680656892936232,
  295: 1.968038114890141,
  296: 1.9680107275499321,
  297: 1.9679835253758984,
  298: 1.967956506496507,
  299: 1.9679296690653623,
  300: 1.9679030112607847,
  301: 1.9678765312853979,
  302: 1.967850227365727,
  303: 1.9678240977517998,
  304: 1.967798140716761,
  305: 1.9677723545564905,
  306: 1.967746737589231,
  307: 1.9677212881552217,
  308: 1.967696004616341,
  309: 1.967670885355754,
  310: 1.9676459287775685,
  311: 1.9676211333064957,
  312: 1.9675964973875213,
  313: 1.967572019485578,
  314: 1.967547698085227,
  315: 1.9675235316903468,
  316: 1.9674995188238256,
  317: 1.9674756580272583,
  318: 1.9674519478606556,
  319: 1.96742838690215,
  320: 1.9674049737477135,
  321: 1.9673817070108799,
  322: 1.9673585853224684,
  323: 1.9673356073303163,
  324: 1.9673127716990173,
  325: 1.9672900771096589,
  326: 1.9672675222595717,
  327: 1.9672451058620788,
  328: 1.9672228266462515,
  329: 1.9672006833566689,
  330: 1.9671786747531816,
  331: 1.9671567996106818,
  332: 1.967135056718874,
  333: 1.9671134448820529,
  334: 1.9670919629188843,
  335: 1.9670706096621893,
  336: 1.967049383958733,
  337: 1.9670282846690177,
  338: 1.9670073106670771,
  339: 1.9669864608402783,
  340: 1.966965734089124,
  341: 1.9669451293270586,
  342: 1.9669246454802793,
  343: 1.9669042814875488,
  344: 1.9668840363000124,
  345: 1.966863908881019,
  346: 1.9668438982059417,
  347: 1.966824003262006,
  348: 1.9668042230481186,
  349: 1.9667845565746986,
  350: 1.9667650028635129,
  351: 1.9667455609475144,
  352: 1.9667262298706825,
  353: 1.966707008687866,
  354: 1.9666878964646288,
  355: 1.9666688922770996,
  356: 1.9666499952118222,
  357: 1.9666312043656085,
  358: 1.9666125188453965,
  359: 1.9665939377681074,
  360: 1.9665754602605063,
  361: 1.9665570854590666,
  362: 1.9665388125098342,
  363: 1.966520640568296,
  364: 1.9665025687992495,
  365: 1.966484596376675,
  366: 1.9664667224836099,
  367: 1.9664489463120245,
  368: 1.9664312670626998,
  369: 1.9664136839451096,
  370: 1.9663961961773,
  371: 1.966378802985776,
  372: 1.9663615036053859,
  373: 1.9663442972792093,
  374: 1.9663271832584475,
  375: 1.9663101608023135,
  376: 1.966293229177927,
  377: 1.9662763876602067,
  378: 1.96625963553177,
  379: 1.9662429720828285,
  380: 1.9662263966110878,
  381: 1.9662099084216513,
  382: 1.9661935068269203,
  383: 1.9661771911465,
  384: 1.9661609607071053,
  385: 1.9661448148424667,
  386: 1.9661287528932416,
  387: 1.9661127742069229,
  388: 1.9660968781377508,
  389: 1.966081064046626,
  390: 1.966065331301024,
  391: 1.966049679274911,
  392: 1.9660341073486605,
  393: 1.9660186149089722,
  394: 1.9660032013487905,
  395: 1.9659878660672256,
  396: 1.9659726084694753,
  397: 1.9659574279667498,
  398: 1.965942323976193,
  399: 1.9659272959208094,
  400: 1.9659123432293915,
  401: 1.9658974653364458,
  402: 1.9658826616821223,
  403: 1.965867931712145,
  404: 1.9658532748777406,
  405: 1.9658386906355727,
  406: 1.9658241784476738,
  407: 1.965809737781378,
  408: 1.9657953681092573,
  409: 1.9657810689090576,
  410: 1.9657668396636336,
  411: 1.965752679860889,
  412: 1.9657385889937122,
  413: 1.9657245665599175,
  414: 1.9657106120621863,
  415: 1.9656967250080057,
  416: 1.9656829049096134,
  417: 1.9656691512839384,
  418: 1.965655463652545,
  419: 1.9656418415415793,
  420: 1.9656282844817121,
  421: 1.9656147920080864,
  422: 1.9656013636602634,
  423: 1.9655879989821707,
  424: 1.9655746975220507,
  425: 1.9655614588324102,
  426: 1.965548282469968,
  427: 1.9655351679956077,
  428: 1.9655221149743287,
  429: 1.9655091229751978,
  430: 1.9654961915712998,
  431: 1.9654833203396942,
  432: 1.9654705088613673,
  433: 1.9654577567211857,
  434: 1.965445063507854,
  435: 1.965432428813868,
  436: 1.9654198522354724,
  437: 1.9654073333726187,
  438: 1.9653948718289207,
  439: 1.9653824672116142,
  440: 1.9653701191315152,
  441: 1.9653578272029781,
  442: 1.9653455910438589,
  443: 1.9653334102754718,
  444: 1.9653212845225516,
  445: 1.9653092134132164,
  446: 1.9652971965789277,
  447: 1.9652852336544535,
  448: 1.9652733242778317,
  449: 1.9652614680903338,
  450: 1.9652496647364275,
  451: 1.9652379138637432,
  452: 1.9652262151230366,
  453: 1.9652145681681563,
  454: 1.9652029726560083,
  455: 1.9651914282465226,
  456: 1.9651799346026202,
  457: 1.9651684913901803,
  458: 1.9651570982780076,
  459: 1.9651457549378,
  460: 1.9651344610441186,
  461: 1.9651232162743548,
  462: 1.9651120203087005,
  463: 1.9651008728301178,
  464: 1.9650897735243085,
  465: 1.9650787220796855,
  466: 1.9650677181873428,
  467: 1.965056761541027,
  468: 1.965045851837109,
  469: 1.965034988774555,
  470: 1.965024172054902,
  471: 1.9650134013822251,
  472: 1.9650026764631154,
  473: 1.9649919970066518,
  474: 1.9649813627243728,
  475: 1.964970773330254,
  476: 1.9649602285406784,
  477: 1.9649497280744153,
  478: 1.9649392716525922,
  479: 1.964928858998672,
  480: 1.9649184898384262,
  481: 1.9649081638999137,
  482: 1.9648978809134563,
  483: 1.9648876406116125,
  484: 1.9648774427291587,
  485: 1.9648672870030628,
  486: 1.9648571731724636,
  487: 1.9648471009786466,
  488: 1.9648370701650248,
  489: 1.9648270804771135,
  490: 1.9648171316625118,
  491: 1.964807223470879,
  492: 1.9647973556539153,
  493: 1.9647875279653397,
  494: 1.9647777401608706,
  495: 1.9647679919982053,
  496: 1.9647582832369994,
  497: 1.9647486136388483,
  498: 1.9647389829672652,
  499: 1.9647293909876653,
  500: 1.9647198374673442,
  501: 1.9647103221754598,
  502: 1.964700844883014,
  503: 1.9646914053628335,
  504: 1.9646820033895525,
  505: 1.964672638739595,
  506: 1.9646633111911553,
  507: 1.9646540205241838,
  508: 1.9646447665203655,
  509: 1.964635548963106,
  510: 1.9646263676375137,
  511: 1.9646172223303833,
  512: 1.9646081128301776,
  513: 1.9645990389270147,
  514: 1.9645900004126484,
  515: 1.9645809970804544,
  516: 1.9645720287254127,
  517: 1.9645630951440949,
  518: 1.964554196134645,
  519: 1.9645453314967691,
  520: 1.9645365010317148,
  521: 1.9645277045422602,
  522: 1.9645189418326983,
  523: 1.964510212708822,
  524: 1.964501516977911,
  525: 1.964492854448715,
  526: 1.9644842249314425,
  527: 1.9644756282377454,
  528: 1.9644670641807058,
  529: 1.964458532574823,
  530: 1.9644500332359982,
  531: 1.9644415659815229,
  532: 1.9644331306300662,
  533: 1.9644247270016604,
  534: 1.964416354917689,
  535: 1.9644080142008735,
  536: 1.9643997046752626,
  537: 1.9643914261662165,
  538: 1.9643831785003991,
  539: 1.9643749615057613,
  540: 1.9643667750115323,
  541: 1.964358618848207,
  542: 1.9643504928475335,
  543: 1.964342396842502,
  544: 1.9643343306673333,
  545: 1.9643262941574684,
  546: 1.9643182871495555,
  547: 1.9643103094814403,
  548: 1.964302360992155,
  549: 1.9642944415219068,
  550: 1.9642865509120675,
  551: 1.9642786890051633,
  552: 1.964270855644863,
  553: 1.9642630506759702,
  554: 1.9642552739444101,
  555: 1.9642475252972216,
  556: 1.9642398045825453,
  557: 1.9642321116496164,
  558: 1.9642244463487513,
  559: 1.9642168085313412,
  560: 1.9642091980498402,
  561: 1.9642016147577568,
  562: 1.964194058509645,
  563: 1.9641865291610932,
  564: 1.9641790265687171,
  565: 1.964171550590149,
  566: 1.9641641010840303,
  567: 1.9641566779100006,
  568: 1.9641492809286911,
  569: 1.964141910001714,
  570: 1.964134564991655,
  571: 1.9641272457620647,
  572: 1.9641199521774493,
  573: 1.964112684103263,
  574: 1.9641054414058998,
  575: 1.9640982239526847,
  576: 1.964091031611867,
  577: 1.9640838642526093,
  578: 1.964076721744983,
  579: 1.9640696039599586,
  580: 1.9640625107693983,
  581: 1.9640554420460483,
  582: 1.9640483976635308,
  583: 1.9640413774963374,
  584: 1.964034381419821,
  585: 1.9640274093101877,
  586: 1.9640204610444916,
  587: 1.9640135365006257,
  588: 1.9640066355573154,
  589: 1.9639997580941106,
  590: 1.963992903991381,
  591: 1.9639860731303063,
  592: 1.9639792653928712,
  593: 1.9639724806618581,
  594: 1.9639657188208401,
  595: 1.9639589797541745,
  596: 1.963952263346997,
  597: 1.963945569485213,
  598: 1.963938898055494,
  599: 1.9639322489452695,
  600: 1.96392562204272,
  601: 1.9639190172367733,
  602: 1.963912434417095,
  603: 1.963905873474085,
  604: 1.9638993342988706,
  605: 1.9638928167832999,
  606: 1.9638863208199362,
  607: 1.9638798463020526,
  608: 1.9638733931236256,
  609: 1.9638669611793291,
  610: 1.9638605503645292,
  611: 1.9638541605752786,
  612: 1.9638477917083106,
  613: 1.963841443661033,
  614: 1.9638351163315244,
  615: 1.9638288096185263,
  616: 1.9638225234214404,
  617: 1.9638162576403206,
  618: 1.96381001217587,
  619: 1.9638037869294331,
  620: 1.9637975818029945,
  621: 1.9637913966991682,
  622: 1.9637852315211985,
  623: 1.9637790861729507,
  624: 1.963772960558908,
  625: 1.9637668545841658,
  626: 1.9637607681544267,
  627: 1.963754701175997,
  628: 1.96374865355578,
  629: 1.9637426252012729,
  630: 1.9637366160205605,
  631: 1.9637306259223126,
  632: 1.9637246548157765,
  633: 1.9637187026107747,
  634: 1.9637127692177012,
  635: 1.9637068545475131,
  636: 1.9637009585117295,
  637: 1.9636950810224274,
  638: 1.9636892219922344,
  639: 1.9636833813343266,
  640: 1.963677558962424,
  641: 1.9636717547907854,
  642: 1.9636659687342057,
  643: 1.96366020070801,
  644: 1.9636544506280507,
  645: 1.9636487184107032,
  646: 1.9636430039728607,
  647: 1.963637307231933,
  648: 1.9636316281058388,
  649: 1.9636259665130043,
  650: 1.9636203223723585,
  651: 1.9636146956033296,
  652: 1.9636090861258415,
  653: 1.9636034938603082,
  654: 1.963597918727633,
  655: 1.9635923606492014,
  656: 1.9635868195468806,
  657: 1.9635812953430134,
  658: 1.9635757879604159,
  659: 1.9635702973223736,
  660: 1.9635648233526377,
  661: 1.9635593659754214,
  662: 1.9635539251153973,
  663: 1.9635485006976923,
  664: 1.9635430926478856,
  665: 1.9635377008920054,
  666: 1.9635323253565247,
  667: 1.9635269659683576,
  668: 1.9635216226548569,
  669: 1.963516295343811,
  670: 1.9635109839634397,
  671: 1.9635056884423918,
  672: 1.9635004087097414,
  673: 1.9634951446949849,
  674: 1.9634898963280374,
  675: 1.9634846635392311,
  676: 1.9634794462593101,
  677: 1.9634742444194289,
  678: 1.9634690579511493,
  679: 1.9634638867864362,
  680: 1.9634587308576554,
  681: 1.9634535900975714,
  682: 1.9634484644393435,
  683: 1.9634433538165224,
  684: 1.963438258163049,
  685: 1.96343317741325,
  686: 1.963428111501836,
  687: 1.9634230603638985,
  688: 1.9634180239349066,
  689: 1.9634130021507055,
  690: 1.9634079949475116,
  691: 1.9634030022619122,
  692: 1.9633980240308617,
  693: 1.9633930601916791,
  694: 1.963388110682045,
  695: 1.9633831754399986,
  696: 1.963378254403937,
  697: 1.9633733475126116,
  698: 1.9633684547051236,
  699: 1.9633635759209254,
  700: 1.9633587110998145,
  701: 1.9633538601819331,
  702: 1.9633490231077657,
  703: 1.9633441998181338,
  704: 1.9633393902541987,
  705: 1.9633345943574538,
  706: 1.9633298120697256,
  707: 1.96332504333317,
  708: 1.9633202880902698,
  709: 1.9633155462838343,
  710: 1.963310817856994,
  711: 1.9633061027532,
  712: 1.9633014009162226,
  713: 1.9632967122901475,
  714: 1.9632920368193745,
  715: 1.963287374448614,
  716: 1.9632827251228866,
  717: 1.9632780887875207,
  718: 1.9632734653881478,
  719: 1.963268854870705,
  720: 1.963264257181428,
  721: 1.9632596722668525,
  722: 1.9632551000738105,
  723: 1.9632505405494287,
  724: 1.963245993641126,
  725: 1.963241459296613,
  726: 1.9632369374638876,
  727: 1.963232428091235,
  728: 1.9632279311272245,
  729: 1.963223446520709,
  730: 1.9632189742208208,
  731: 1.963214514176972,
  732: 1.9632100663388516,
  733: 1.9632056306564227,
  734: 1.9632012070799227,
  735: 1.9631967955598593,
  736: 1.9631923960470097,
  737: 1.9631880084924196,
  738: 1.9631836328473993,
  739: 1.9631792690635235,
  740: 1.9631749170926298,
  741: 1.9631705768868148,
  742: 1.9631662483984351,
  743: 1.9631619315801037,
  744: 1.9631576263846882,
  745: 1.9631533327653103,
  746: 1.9631490506753435,
  747: 1.963144780068411,
  748: 1.963140520898385,
  749: 1.9631362731193833,
  750: 1.9631320366857699,
  751: 1.9631278115521522,
  752: 1.9631235976733785,
  753: 1.9631193950045382,
  754: 1.963115203500959,
  755: 1.963111023118206,
  756: 1.9631068538120793,
  757: 1.963102695538613,
  758: 1.963098548254074,
  759: 1.963094411914959,
  760: 1.963090286477995,
  761: 1.9630861719001376,
  762: 1.9630820681385661,
  763: 1.963077975150687,
  764: 1.963073892894129,
  765: 1.9630698213267435,
  766: 1.9630657604066017,
  767: 1.9630617100919938,
  768: 1.9630576703414275,
  769: 1.9630536411136277,
  770: 1.9630496223675324,
  771: 1.963045614062295,
  772: 1.963041616157278,
  773: 1.9630376286120574,
  774: 1.9630336513864166,
  775: 1.9630296844403485,
  776: 1.9630257277340504,
  777: 1.9630217812279265,
  778: 1.9630178448825841,
  779: 1.963013918658834,
  780: 1.9630100025176869,
  781: 1.9630060964203544,
  782: 1.9630022003282468,
  783: 1.9629983142029712,
  784: 1.9629944380063318,
  785: 1.962990571700327,
  786: 1.9629867152471494,
  787: 1.9629828686091835,
  788: 1.9629790317490055,
  789: 1.962975204629381,
  790: 1.9629713872132657,
  791: 1.9629675794638015,
  792: 1.962963781344317,
  793: 1.9629599928183272,
  794: 1.9629562138495296,
  795: 1.9629524444018054,
  796: 1.9629486844392179,
  797: 1.9629449339260105,
  798: 1.9629411928266058,
  799: 1.962937461105606,
  800: 1.9629337387277892,
  801: 1.9629300256581104,
  802: 1.9629263218616995,
  803: 1.9629226273038602,
  804: 1.9629189419500692,
  805: 1.9629152657659752,
  806: 1.9629115987173975,
  807: 1.9629079407703247,
  808: 1.9629042918909145,
  809: 1.9629006520454917,
  810: 1.9628970212005485,
  811: 1.9628933993227415,
  812: 1.9628897863788926,
  813: 1.9628861823359869,
  814: 1.962882587161172,
  815: 1.9628790008217571,
  816: 1.9628754232852115,
  817: 1.9628718545191641,
  818: 1.9628682944914029,
  819: 1.9628647431698727,
  820: 1.9628612005226753,
  821: 1.9628576665180681,
  822: 1.9628541411244633,
  823: 1.9628506243104265,
  824: 1.962847116044676,
  825: 1.962843616296083,
  826: 1.9628401250336684,
  827: 1.9628366422266041,
  828: 1.9628331678442101,
  829: 1.962829701855956,
  830: 1.9628262442314577,
  831: 1.9628227949404782,
  832: 1.9628193539529253,
  833: 1.962815921238852,
  834: 1.9628124967684557,
  835: 1.962809080512076,
  836: 1.9628056724401943,
  837: 1.962802272523434,
  838: 1.9627988807325591,
  839: 1.9627954970384724,
  840: 1.9627921214122162,
  841: 1.96278875382497,
  842: 1.9627853942480507,
  843: 1.9627820426529121,
  844: 1.9627786990111424,
  845: 1.9627753632944653,
  846: 1.962772035474738,
  847: 1.962768715523951,
  848: 1.962765403414227,
  849: 1.9627620991178198,
  850: 1.9627588026071152,
  851: 1.9627555138546275,
  852: 1.9627522328330012,
  853: 1.962748959515009,
  854: 1.962745693873551,
  855: 1.9627424358816548,
  856: 1.9627391855124732,
  857: 1.9627359427392859,
  858: 1.9627327075354966,
  859: 1.9627294798746329,
  860: 1.9627262597303463,
  861: 1.9627230470764099,
  862: 1.962719841886719,
  863: 1.962716644135291,
  864: 1.9627134537962623,
  865: 1.9627102708438906,
  866: 1.9627070952525512,
  867: 1.9627039269967388,
  868: 1.9627007660510651,
  869: 1.9626976123902597,
  870: 1.9626944659891674,
  871: 1.9626913268227497,
  872: 1.9626881948660826,
  873: 1.9626850700943568,
  874: 1.9626819524828756,
  875: 1.9626788420070573,
  876: 1.962675738642431,
  877: 1.9626726423646375,
  878: 1.9626695531494305,
  879: 1.962666470972672,
  880: 1.9626633958103352,
  881: 1.9626603276385024,
  882: 1.962657266433364,
  883: 1.962654212171219,
  884: 1.962651164828473,
  885: 1.962648124381639,
  886: 1.962645090807336,
  887: 1.9626420640822897,
  888: 1.9626390441833281,
  889: 1.9626360310873863,
  890: 1.9626330247715016,
  891: 1.962630025212815,
  892: 1.962627032388571,
  893: 1.9626240462761142,
  894: 1.9626210668528927,
  895: 1.9626180940964544,
  896: 1.9626151279844477,
  897: 1.9626121684946207,
  898: 1.9626092156048216,
  899: 1.9626062692929966,
  900: 1.9626033295371899,
  901: 1.9626003963155434,
  902: 1.9625974696062964,
  903: 1.9625945493877848,
  904: 1.9625916356384394,
  905: 1.9625887283367882,
  906: 1.9625858274614525,
  907: 1.962582932991149,
  908: 1.9625800449046875,
  909: 1.9625771631809725,
  910: 1.962574287799,
  911: 1.9625714187378587,
  912: 1.9625685559767294,
  913: 1.9625656994948841,
  914: 1.9625628492716856,
  915: 1.9625600052865868,
  916: 1.9625571675191313,
  917: 1.9625543359489512,
  918: 1.9625515105557676,
  919: 1.9625486913193901,
  920: 1.9625458782197165,
  921: 1.9625430712367309,
  922: 1.962540270350506,
  923: 1.9625374755412,
  924: 1.962534686789057,
  925: 1.962531904074407,
  926: 1.9625291273776646,
  927: 1.96252635667933,
  928: 1.9625235919599864,
  929: 1.962520833200302,
  930: 1.9625180803810265,
  931: 1.962515333482994,
  932: 1.9625125924871198,
  933: 1.9625098573744026,
  934: 1.9625071281259212,
  935: 1.962504404722836,
  936: 1.9625016871463874,
  937: 1.9624989753778976,
  938: 1.9624962693987664,
  939: 1.9624935691904748,
  940: 1.9624908747345817,
  941: 1.9624881860127243,
  942: 1.9624855030066184,
  943: 1.9624828256980582,
  944: 1.962480154068913,
  945: 1.962477488101131,
  946: 1.962474827776736,
  947: 1.9624721730778274,
  948: 1.962469523986581,
  949: 1.9624668804852476,
  950: 1.9624642425561525,
  951: 1.962461610181696,
  952: 1.9624589833443515,
  953: 1.9624563620266673,
  954: 1.9624537462112641,
  955: 1.9624511358808356,
  956: 1.9624485310181483,
  957: 1.9624459316060407,
  958: 1.9624433376274224,
  959: 1.9624407490652758,
  960: 1.9624381659026522,
  961: 1.9624355881226763,
  962: 1.962433015708541,
  963: 1.9624304486435091,
  964: 1.9624278869109137,
  965: 1.9624253304941575,
  966: 1.9624227793767104,
  967: 1.9624202335421121,
  968: 1.9624176929739703,
  969: 1.9624151576559599,
  970: 1.962412627571823,
  971: 1.9624101027053702,
  972: 1.9624075830404768,
  973: 1.9624050685610865,
  974: 1.962402559251207,
  975: 1.9624000550949139,
  976: 1.9623975560763454,
  977: 1.962395062179708,
  978: 1.9623925733892695,
  979: 1.9623900896893647,
  980: 1.9623876110643914,
  981: 1.9623851374988106,
  982: 1.9623826689771475,
  983: 1.96238020548399,
  984: 1.9623777470039887,
  985: 1.962375293521857,
  986: 1.9623728450223694,
  987: 1.9623704014903631,
  988: 1.9623679629107367,
  989: 1.9623655292684494,
  990: 1.9623631005485223,
  991: 1.9623606767360353,
  992: 1.9623582578161303,
  993: 1.9623558437740083,
  994: 1.9623534345949294,
  995: 1.9623510302642144,
  996: 1.9623486307672415,
  997: 1.9623462360894495,
  998: 1.962343846216334,
  999: 1.962341461133449,
  1000: 1.9623390808264078,
  1001: 1.9623367052808791,
  1002: 1.9623343344825908,
  1003: 1.962331968417326,
  1004: 1.9623296070709262,
  1005: 1.9623272504292881,
  1006: 1.9623248984783654,
  1007: 1.9623225512041673,
  1008: 1.9623202085927578,
  1009: 1.9623178706302578,
  1010: 1.9623155373028418,
  1011: 1.9623132085967403,
  1012: 1.962310884498237,
  1013: 1.962308564993671,
  1014: 1.962306250069434,
  1015: 1.9623039397119733,
  1016: 1.9623016339077874,
  1017: 1.9622993326434304,
  1018: 1.962297035905507,
  1019: 1.9622947436806755,
  1020: 1.9622924559556474,
  1021: 1.962290172717185,
  1022: 1.9622878939521027,
  1023: 1.9622856196472673,
  1024: 1.962283349789597,
  infinity: 1.96,
})

// Student two-tailed t-distribution has no minimum samples size.
// But for 95% confidence level and 80% statistical power on samples with unknown previous standard deviation, 128 samples are recommended.
export const minimumSamples = 128

export const defaultSamples = minimumSamples

export const defaultTime = 1e9 // ns

export const defaultWarmupRuns = 12

export const highRelativeMarginOfError = 8
