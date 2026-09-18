import React, { useId } from 'react';

const LABELS = {
  neck: '颈部与斜方肌', shoulder: '肩部与三角肌', chest: '胸部与胸大肌',
  upperBack: '上背部肌群', lowerBack: '下背部肌群', arm: '上臂肌群', forearm: '前臂肌群',
  abs: '腹部核心肌群', hip: '臀部肌群', thigh: '大腿肌群', calf: '小腿肌群',
  // Internal aliases keep the drawing easy to read while preserving the public anatomy ids.
  back: '背部肌群', arms: '手臂肌群', waist: '腰腹部肌群', hips: '臀部肌群',
};

/** An original, schematic anatomical atlas. Each region is also a keyboard target. */
export default function BodyAtlas({
  view = 'front',
  layer = 'muscles',
  selected = 'neck',
  hovered = null,
  onSelect = () => {},
  onHover,
  onHoverChange,
}) {
  const prefix = `anatomy-${useId().replace(/:/g, '')}`;
  const back = view === 'back';
  const handleHover = onHover || onHoverChange || (() => {});
  // `muscles` remains the public default and maps to the superficial layer.
  const nerve = layer === 'nerve' || layer === 'nerves';
  const deep = layer === 'deep';
  const superficial = !nerve && !deep;
  // Region ids have a few public aliases (for example, `arm` maps to the
  // internal `arms` drawing). Treat the hovered region exactly like the
  // selected region so pointer and keyboard focus share the same highlight.
  const matchesRegion = (target, id) => target === id ||
    (target === 'arm' && id === 'arms') || (target === 'forearm' && id === 'arms') ||
    (target === 'abs' && id === 'waist') || (target === 'hip' && id === 'hips') ||
    (target === 'upperBack' && id === 'back') || (target === 'lowerBack' && id === 'back');
  const selectedFor = id => matchesRegion(selected, id);
  const activeFor = id => selectedFor(id) || matchesRegion(hovered, id);
  const url = (name) => `url(#${prefix}-${name})`;
  const region = (id, children, label) => (
    <g key={id} data-region={id} role="button" tabIndex={0}
      aria-label={label || LABELS[id]} aria-pressed={selected === id}
      onClick={() => onSelect(id)}
      onMouseEnter={() => handleHover(id)}
      onMouseLeave={() => handleHover(null)}
      onFocus={() => handleHover(id)}
      onBlur={() => handleHover(null)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onSelect(id); }
      }}
      style={{ cursor: 'pointer', outlineOffset: 5 }}>
      <title>{label || LABELS[id]}</title>
      {children}
    </g>
  );
  const muscle = (d, id, fibers = [], dark = false) => (
    <g>
      <path d={d} fill={url(selectedFor(id) && !nerve ? 'active' : matchesRegion(hovered, id) && !nerve ? 'hover' : dark ? 'muscle-dark' : 'muscle')}
        stroke={activeFor(id) && !nerve ? '#c8f542' : '#b8b8b1'} strokeWidth=".75" strokeLinejoin="round" />
      <g fill="none" stroke={activeFor(id) && !nerve ? '#d3ff3b' : '#9a9a93'} strokeWidth=".6" opacity={activeFor(id) && !nerve ? '.56' : '.44'}>
        {fibers.map((d, index) => <path key={index} d={d} />)}
      </g>
    </g>
  );
  const both = (children) => [<g key="left">{children}</g>, <g key="right" transform="translate(360 0) scale(-1 1)">{children}</g>];

  const outline = 'M180 29 C164 28 151 36 150 51 L150 65 C144 62 142 67 146 79 L153 87 C156 94 160 99 164 102 L164 113 C154 121 140 123 125 127 C109 130 97 139 94 155 C87 177 84 193 80 212 C75 229 71 243 69 258 C62 277 59 295 57 313 L51 343 L47 357 C40 363 36 371 35 380 L31 396 C30 400 33 402 36 398 L41 386 L36 408 C35 414 39 416 42 411 L48 390 L44 414 C43 420 47 421 50 415 L56 392 L53 413 C52 418 56 420 59 414 L65 390 L64 403 C64 408 68 409 70 404 L74 384 C75 375 72 367 70 359 L77 337 C89 314 95 291 98 268 C108 247 111 228 116 207 L124 184 C128 199 132 217 132 234 C133 252 131 270 128 286 C125 306 126 321 131 339 C126 360 122 383 122 408 C121 430 125 449 129 466 C126 480 122 496 122 512 C122 536 129 558 134 579 L137 610 C135 618 128 625 124 632 C119 640 121 647 130 650 L149 651 C160 652 166 650 166 644 L161 617 C161 600 166 578 166 558 C173 535 174 516 170 495 C171 482 173 468 172 458 C178 432 179 410 178 391 L180 371 L182 391 C181 410 182 432 188 458 C187 468 189 482 190 495 C186 516 187 535 194 558 C194 578 199 600 199 617 L194 644 C194 650 200 652 211 651 L230 650 C239 647 241 640 236 632 C232 625 225 618 223 610 L226 579 C231 558 238 536 238 512 C238 496 234 480 231 466 C235 449 239 430 238 408 C238 383 234 360 229 339 C234 321 235 306 232 286 C229 270 227 252 228 234 C228 217 232 199 236 184 L244 207 C249 228 252 247 262 268 C265 291 271 314 283 337 L290 359 C288 367 285 375 286 384 L290 404 C292 409 296 408 296 403 L295 390 L301 414 C304 420 308 418 307 413 L304 392 L310 415 C313 421 317 420 316 414 L312 390 L318 411 C321 416 325 414 324 408 L319 386 L324 398 C327 402 330 400 329 396 L325 380 C324 371 320 363 313 357 L309 343 L303 313 C301 295 298 277 291 258 C289 243 285 229 280 212 C276 193 273 177 266 155 C263 139 251 130 235 127 C220 123 206 121 196 113 L196 102 C200 99 204 94 207 87 L214 79 C218 67 216 62 210 65 L210 51 C209 36 196 28 180 29Z';

  const neckFront = <>
    {both(<>
      {muscle('M164 104 C160 114 147 121 133 128 L167 139 L177 132 C170 124 166 114 164 104Z', 'neck', [
        'M161 114 Q161 126 172 135', 'M157 119 Q157 128 167 137', 'M151 123 L161 136', 'M144 126 L155 135',
      ])}
      {muscle('M166 98 C166 116 170 124 177 132 L179 121 L171 101Z', 'neck', ['M169 103 Q169 118 176 126'])}
    </>)}
    <path d="M175 112 Q180 108 185 112 L184 125 L180 131 L176 125Z" fill={url('bone')} stroke="#b9b9b2" strokeWidth=".6" />
    <path d="M176 116 L184 116 M177 120 L183 120 M178 124 L182 124" stroke="#aaaaa3" strokeWidth=".7" />
  </>;

  const neckBack = <>
    {both(muscle('M165 96 C166 112 155 122 131 131 C146 148 162 170 178 192 L178 120 L173 101Z', 'neck', [
      'M169 111 Q164 126 144 133', 'M172 116 Q167 133 151 143', 'M174 125 Q170 141 156 150',
      'M175 137 L162 159', 'M175 151 L168 170', 'M171 118 L173 176',
    ]))}
    <path d="M180 103 L180 193" fill="none" stroke="#aaaaa3" strokeWidth="1.1" />
  </>;

  const shoulders = both(muscle(
    back ? 'M130 130 C112 128 100 138 96 156 L91 181 C98 184 108 179 116 168 L138 142Z' : 'M130 130 C111 128 101 138 96 154 L92 181 C103 180 114 170 118 155 L134 141Z',
    'shoulder', [
      'M123 133 Q104 147 96 172', 'M128 135 Q112 147 100 176', 'M118 133 Q101 143 96 160',
      'M128 141 Q117 157 106 173', 'M113 135 Q100 143 97 151',
    ], true
  ));

  const chest = both(muscle('M136 133 C147 135 163 139 177 135 L177 183 C165 192 145 190 132 178 L119 159 C123 150 128 140 136 133Z', 'chest', [
    'M134 138 Q151 148 174 142', 'M131 143 Q150 155 174 148', 'M128 148 Q149 161 175 155',
    'M126 153 Q148 167 175 162', 'M125 159 Q146 174 175 169', 'M129 167 Q149 182 175 177',
    'M139 180 Q156 188 173 182',
  ]));

  const backMuscles = both(<>
    {muscle('M136 144 L173 190 C164 202 145 203 129 187 L122 166Z', 'upperBack', [
      'M131 152 Q145 177 168 186', 'M129 160 Q146 184 167 191', 'M128 169 Q143 190 159 195',
      'M129 178 Q140 192 151 196',
    ])}
    {muscle('M126 182 C140 196 152 202 175 197 L176 282 L150 304 C139 273 130 245 126 215 L121 196Z', 'upperBack', [
      'M129 197 Q143 216 174 224', 'M131 208 Q146 226 174 234', 'M132 219 Q147 236 174 244',
      'M135 231 Q151 248 174 254', 'M139 245 Q154 260 174 265', 'M143 260 Q155 274 174 276',
      'M146 276 L168 288',
    ], true)}
    {muscle('M173 194 L178 200 L177 294 L170 313 L165 291 L168 243Z', 'lowerBack', [
      'M172 224 L172 289', 'M175 208 L174 294', 'M169 262 L169 299',
    ])}
    <path d="M125 163 Q124 177 131 186 L159 193" fill="none" stroke="#f0efeb" strokeWidth="2" />
  </>);

  const arms = both(<>
    {muscle(back ? 'M112 172 C117 184 108 218 101 236 L87 244 C83 222 89 197 95 180Z' : 'M112 175 C114 189 108 215 99 232 C96 238 88 243 85 235 C84 219 90 194 95 183Z', 'arm', [
      'M105 184 Q104 210 90 232', 'M109 181 Q108 210 95 232', 'M101 188 Q95 213 88 228',
      'M97 195 L88 222',
    ])}
    {muscle('M83 217 C81 231 75 246 73 260 L83 269 L97 247 L98 234 L88 245Z', 'arm', [
      'M83 236 L78 258', 'M90 248 L83 263', 'M79 247 L77 254',
    ], true)}
    {muscle('M73 263 C67 281 63 305 59 327 L55 345 L60 355 L75 324 C86 302 90 283 87 269 L82 266Z', 'forearm', [
      'M78 273 Q75 303 59 342', 'M82 273 Q82 292 66 330', 'M74 273 L62 324',
      'M69 283 L60 331', 'M84 280 Q80 304 71 322',
    ])}
    {muscle('M89 270 C91 286 82 313 77 328 L67 358 L62 356 L68 332 L75 304Z', 'forearm', [
      'M85 284 L73 330 L66 351', 'M81 294 L73 323',
    ], true)}
    <g fill="none" stroke="#aaaaa3" strokeWidth=".85" opacity=".75">
      <path d="M59 347 L56 368 L43 392 M62 351 L61 370 L51 401 M65 353 L66 373 L58 403 M70 362 L70 375 L66 394" />
      <path d="M52 367 Q55 375 51 385 M45 376 L38 393 M46 402 L44 408 M53 405 L51 412 M60 402 L58 411" />
    </g>
    <path d="M61 364 Q48 358 40 378 Q42 386 46 381 L52 374 Q53 382 62 383 L67 374Z" fill={url('muscle')} stroke="#b8b8b1" strokeWidth=".55" />
  </>);

  const waistFront = <>
    {both(<>
      {muscle('M136 187 L151 194 L153 259 L163 297 L147 295 C133 267 130 242 131 219 L123 197Z', 'waist', [
        'M133 203 L149 211', 'M134 213 L149 222', 'M135 224 L150 234',
        'M136 236 L153 247', 'M139 250 L155 260', 'M141 263 L158 274', 'M145 277 L160 286',
      ], true)}
      {[0, 1, 2, 3].map((i) => <React.Fragment key={i}>
        {muscle(`M155 ${194 + i * 23} Q165 ${190 + i * 23} 177 ${193 + i * 23} L177 ${211 + i * 23} Q166 ${217 + i * 23} 155 ${211 + i * 23}Z`, 'waist', [
          `M159 ${198 + i * 23} L159 ${208 + i * 23}`, `M165 ${196 + i * 23} L166 ${211 + i * 23}`, `M172 ${195 + i * 23} L173 ${210 + i * 23}`,
        ])}
      </React.Fragment>)}
      {muscle('M156 285 L177 283 L177 323 L168 336 L155 310 L147 296Z', 'waist', ['M162 291 L166 318', 'M168 291 L171 325', 'M174 289 L174 318'])}
      <path d="M126 187 L138 193 L133 199 M128 196 L142 203 L134 208 M129 206 L145 214 L134 219" fill="none" stroke="#b5b5ae" strokeWidth="1.4" />
    </>)}
    <path d="M180 187 L180 254 M180 268 L180 322" stroke="#b5b5ae" strokeWidth="1.1" fill="none" />
    <ellipse cx="180" cy="262" rx="2" ry="3.5" fill="#a6a69f" />
  </>;

  const waistBack = both(muscle('M130 257 C140 273 148 291 168 309 L174 321 L160 332 L134 316 C129 299 128 279 130 257Z', 'waist', [
    'M132 273 Q145 299 166 317', 'M132 285 L160 319', 'M133 298 L153 320',
  ]));

  const hips = both(muscle(
    back ? 'M154 314 C164 316 173 321 178 333 L177 371 C165 386 144 382 132 370 C126 354 128 333 134 322Z' : 'M144 298 L162 325 L174 344 L177 365 L156 357 L138 340 L130 327 C129 312 133 303 144 298Z',
    'hips', back ? [
      'M145 322 Q164 328 173 341', 'M136 331 Q161 334 174 350', 'M132 341 Q159 343 174 358',
      'M131 352 Q153 351 173 365', 'M133 363 Q153 360 171 372', 'M142 373 L163 375',
    ] : ['M137 308 Q143 328 161 346', 'M134 316 Q139 335 155 347', 'M136 328 L147 344', 'M145 306 L166 341'], true
  ));

  const thighs = both(<>
    {muscle(back ? 'M135 377 C144 385 153 386 159 382 L156 440 L142 462 C131 438 126 407 135 377Z' : 'M142 346 C150 344 159 359 159 384 L156 426 C153 442 148 451 140 456 C132 436 129 414 131 389 C132 369 135 352 142 346Z', 'thigh', [
      'M141 359 Q135 406 142 445', 'M146 359 Q140 405 146 443', 'M151 369 Q148 405 149 433',
      'M136 380 Q131 409 138 434',
    ])}
    {muscle(back ? 'M162 381 L175 374 C177 397 175 429 169 450 L162 461 L158 441Z' : 'M161 359 L175 372 C178 395 174 422 169 439 L162 457 L154 446 C160 420 162 390 161 359Z', 'thigh', [
      'M170 378 Q172 414 162 442', 'M166 378 L165 420', 'M173 392 L168 424',
    ], true)}
    {muscle('M132 349 L138 356 C127 394 130 424 137 446 L133 455 C125 435 123 414 124 394 C125 374 127 360 132 349Z', 'thigh', [
      'M131 369 Q124 407 132 438',
    ], true)}
    {!back && muscle('M154 425 C156 438 164 442 166 451 L162 465 L151 466 L146 456Z', 'thigh', [
      'M153 437 Q155 449 160 459', 'M151 445 L156 460',
    ])}
    <path d="M134 460 Q144 450 155 465 Q162 479 148 487 L139 484 Q130 475 134 460Z" fill={url('bone')} stroke="#bbbbb4" strokeWidth=".8" />
    <path d="M137 464 Q144 459 151 466 M138 480 Q146 484 153 477" fill="none" stroke="#d3d3cc" strokeWidth="2" />
  </>);

  const calves = both(<>
    {muscle(back ? 'M135 484 C122 502 125 527 134 550 L145 566 C152 548 153 525 148 502 L143 485Z' : 'M132 483 C123 500 125 524 132 543 L142 565 L145 548 C141 522 143 501 139 486Z', 'calf', [
      'M132 496 Q128 522 140 550', 'M136 494 Q133 520 141 540', 'M131 510 L136 535',
    ])}
    {muscle(back ? 'M153 485 C163 489 170 504 168 525 C167 542 157 558 149 565 L148 539 L150 506Z' : 'M151 485 L162 486 C168 507 168 530 161 553 L153 585 L146 588 L146 558 C151 532 152 507 151 485Z', 'calf', [
      'M158 493 Q163 529 151 562', 'M154 493 Q156 526 149 546', 'M163 508 Q165 528 157 547',
      'M158 547 L150 576',
    ], true)}
    {muscle('M136 550 L144 568 L145 589 L143 612 L139 618 L140 582Z', 'calf', ['M139 563 L143 588 L141 608'])}
    <path d="M151 573 L150 610 M156 564 L153 606 M139 616 Q145 620 155 615" stroke="#b0b0a9" strokeWidth="1.3" fill="none" />
    <path d="M140 613 Q148 619 156 613 L159 637 Q151 640 140 643 L126 641 Q127 633 140 613Z" fill={url('bone')} stroke="#bdbdb6" strokeWidth=".65" />
    <g stroke="#a6a69f" strokeWidth=".7" fill="none" opacity=".8">
      <path d="M143 619 L135 639 M148 620 L142 641 M153 620 L149 640 M157 635 L154 642" />
      <path d="M127 641 Q130 638 134 642 L134 648 M137 642 Q140 640 143 644 L143 649 M146 643 Q150 642 151 646 L151 650 M154 643 L157 648" />
    </g>
  </>);

  // Deep layer: simplified but anatomically useful landmarks that sit below
  // the superficial muscle map. They intentionally share the same region ids
  // so selection and keyboard navigation continue to work in every layer.
  const deepFront = both(<>
    {muscle('M145 132 C153 137 165 143 176 141 L176 174 C162 169 151 159 142 149Z', 'chest', ['M148 141 Q161 151 174 154', 'M146 147 Q160 158 174 162'], true)}
    {muscle('M131 146 C119 153 111 165 108 181 L124 188 C132 175 141 163 151 157Z', 'shoulder', ['M127 154 Q118 168 115 180', 'M135 157 Q125 171 122 183'], true)}
    {muscle('M137 183 L151 188 L153 260 L145 293 L134 264 L130 218Z', 'abs', ['M137 194 L147 209', 'M136 210 L149 226', 'M137 229 L150 246', 'M139 249 L150 267'], true)}
    {muscle('M154 185 L176 185 L176 255 L164 287 L154 257Z', 'abs', ['M159 191 L160 245', 'M167 190 L169 247', 'M174 190 L174 244'], true)}
    {muscle('M139 298 C144 288 155 287 164 298 L174 324 L163 342 L148 330Z', 'hip', ['M145 302 Q155 317 166 329', 'M151 296 Q160 315 171 324'], true)}
    {muscle('M137 345 C145 340 152 348 154 365 L149 451 L139 466 C132 430 129 382 137 345Z', 'thigh', ['M141 356 Q138 407 143 449', 'M147 359 Q144 408 146 438'])}
    {muscle('M155 347 C164 342 171 352 173 370 L166 455 L156 466 L151 438 L156 383Z', 'thigh', ['M162 360 Q168 403 160 447', 'M168 371 Q170 410 163 435'], true)}
    {muscle('M136 482 C128 504 130 535 141 566 L145 585 L148 543 L143 501Z', 'calf', ['M137 495 Q133 526 143 558', 'M140 503 L144 540'], true)}
    {muscle('M151 484 C162 492 165 516 159 542 L149 584 L146 548 L150 510Z', 'calf', ['M157 498 Q161 523 150 566', 'M153 503 Q156 531 149 548'], true)}
  </>);

  const deepBack = both(<>
    {muscle('M141 140 C153 147 167 153 176 153 L176 191 L160 207 L143 184Z', 'upperBack', ['M145 151 Q157 172 173 185', 'M150 153 Q163 177 174 192'], true)}
    {muscle('M126 161 L143 181 L157 203 L146 218 L130 198 L120 177Z', 'upperBack', ['M128 171 Q139 191 151 207', 'M124 180 Q137 200 145 213'])}
    {muscle('M167 188 L177 193 L176 312 L166 330 L160 293Z', 'lowerBack', ['M171 201 L171 305', 'M174 220 L173 298'], true)}
    {muscle('M151 207 L166 198 L166 311 L156 326 L147 286Z', 'lowerBack', ['M153 218 L159 298', 'M159 211 L163 286'])}
    {muscle('M137 306 C145 315 157 319 173 329 L174 365 C160 379 143 375 132 362 L130 335Z', 'hip', ['M137 321 Q155 337 171 346', 'M134 334 Q154 349 171 357', 'M136 348 Q153 361 168 367'], true)}
    {muscle('M138 378 C148 371 157 379 158 400 L151 458 L140 470 L134 430Z', 'thigh', ['M141 389 Q143 430 145 458', 'M149 386 L149 443'])}
    {muscle('M158 378 C168 372 175 382 174 403 L166 457 L156 469 L154 430Z', 'thigh', ['M165 388 Q168 422 160 456', 'M170 394 L165 438'], true)}
    {muscle('M136 484 C126 505 128 533 139 560 L145 576 L146 536 L142 500Z', 'calf', ['M136 496 Q131 526 142 559'], true)}
    {muscle('M151 484 C163 491 166 518 158 546 L149 578 L147 540 L151 505Z', 'calf', ['M157 498 Q161 526 150 563'], true)}
  </>);

  const deepStructures = deep && <>
    {back ? deepBack : deepFront}
    {both(<>
      {muscle(back ? 'M166 98 L175 102 L177 141 L162 160 L155 145 L163 123Z' : 'M168 100 L176 106 L177 139 L169 133 L163 116Z', 'neck', ['M170 106 L172 130', 'M166 112 L171 134'], true)}
      {muscle('M105 178 L113 187 Q109 219 94 241 L85 237 Q92 208 105 178Z', 'arm', ['M105 191 L91 233', 'M107 190 L96 231'], true)}
      {muscle('M77 266 L86 274 Q81 313 65 352 L57 351 L65 310Z', 'forearm', ['M77 278 L63 341', 'M80 280 L66 338'], true)}
    </>)}
    {/* Transparent hit zones keep every public region selectable in deep view. */}
    {region('neck', <path d="M156 94 L204 94 L204 138 L156 138Z" fill="transparent" />)}
    {region('shoulder', both(<path d="M103 126 L145 126 L145 188 L96 188Z" fill="transparent" />))}
    {back ? <>
      {region('upperBack', both(<path d="M121 138 L178 138 L178 238 L121 238Z" fill="transparent" />))}
      {region('lowerBack', both(<path d="M122 232 L178 232 L178 337 L122 337Z" fill="transparent" />))}
    </> : region('chest', both(<path d="M119 132 L178 132 L178 190 L119 190Z" fill="transparent" />))}
    {region('arm', both(<path d="M82 170 L116 170 L100 270 L72 270Z" fill="transparent" />))}
    {region('forearm', both(<path d="M52 230 L93 230 L74 360 L46 360Z" fill="transparent" />))}
    {region('abs', both(<path d="M126 184 L178 184 L178 320 L126 320Z" fill="transparent" />))}
    {region('hip', both(<path d="M128 296 L178 296 L178 377 L128 377Z" fill="transparent" />))}
    {region('thigh', both(<path d="M124 340 L178 340 L178 474 L124 474Z" fill="transparent" />))}
    {region('calf', both(<path d="M122 477 L172 477 L164 620 L125 620Z" fill="transparent" />))}
  </>;

  const nerveBranches = [
    ['neck', 'M180 96 L180 129 M180 111 Q165 117 155 127 L145 133 M164 119 L164 109 M155 127 L147 121 M180 119 Q168 125 161 134'],
    ['shoulder', 'M180 130 Q148 128 125 142 L105 164 M129 140 L118 154 L118 165 M116 151 L104 154 M112 157 L100 173'],
    ['chest', 'M180 143 Q157 144 132 157 M174 155 Q151 156 133 168 M175 167 Q153 173 139 180 M159 146 L152 138'],
    ['back', 'M180 150 L180 278 M179 181 Q153 188 134 205 M179 205 Q151 216 138 230 M179 228 Q155 237 143 251 M177 254 L151 269'],
    ['arms', 'M111 159 Q98 197 88 235 L83 261 Q73 299 62 350 L56 375 M92 220 L98 218 L103 202 M83 260 L74 275 L66 306 M83 271 L85 291 L75 320 M62 347 L68 363 L67 382 L66 398 M56 375 L42 404 M56 375 L50 411 M56 375 L58 412 M56 375 L43 378 L36 396'],
    ['waist', 'M180 224 L180 313 M178 250 Q157 251 143 263 M178 270 Q157 275 145 290 M179 290 L158 310 M160 276 L151 273 M165 303 L162 317'],
    ['hips', 'M180 302 Q160 314 149 335 L143 355 M164 315 L168 336 L160 351 M153 329 L136 325 M148 341 L133 345'],
    ['thigh', 'M149 340 Q140 383 146 430 L148 469 M146 367 L156 381 L159 406 M143 386 L132 403 L134 424 M146 422 L159 439 L162 459 M144 413 L137 436'],
    ['calf', 'M148 470 L151 493 Q152 531 148 563 L147 607 L141 633 M151 491 L136 502 L136 527 M150 527 L160 544 L156 573 M147 607 L153 631 L155 645 M141 633 L133 646 M144 625 L143 647 M145 614 L137 624 L128 640'],
  ];

  return (
    <svg className="body-atlas-svg" viewBox="0 0 440 650" xmlns="http://www.w3.org/2000/svg"
      aria-label={`${back ? '背面' : '正面'}人体${nerve ? '神经' : deep ? '深层肌肉' : '浅层肌肉'}图谱，点击或使用键盘选择身体部位`}
      style={{ display: 'block', width: '100%', height: '100%', overflow: 'visible' }}>
      <defs>
        <linearGradient id={`${prefix}-body`} x1="0" x2="1">
          <stop offset="0" stopColor="#cfcfc9" /><stop offset=".2" stopColor="#e9e8e3" />
          <stop offset=".44" stopColor="#f5f4f0" /><stop offset=".61" stopColor="#e4e3de" />
          <stop offset=".8" stopColor="#ebeae5" /><stop offset="1" stopColor="#c6c6c0" />
        </linearGradient>
        <linearGradient id={`${prefix}-bone`} x1="0" x2="1">
          <stop offset="0" stopColor="#cdcdc6" /><stop offset=".45" stopColor="#f3f2ee" /><stop offset="1" stopColor="#c4c4bd" />
        </linearGradient>
        <linearGradient id={`${prefix}-muscle`} x1="0" y1=".2" x2="1" y2=".65">
          <stop offset="0" stopColor="#c5c5be" /><stop offset=".24" stopColor="#dad9d2" />
          <stop offset=".52" stopColor="#e7e6e0" /><stop offset=".78" stopColor="#d3d2cb" /><stop offset="1" stopColor="#bcbcb5" />
        </linearGradient>
        <linearGradient id={`${prefix}-muscle-dark`} x1="0" y1="0" x2="1" y2=".5">
          <stop offset="0" stopColor="#b7b7b0" /><stop offset=".4" stopColor="#d0cfc8" />
          <stop offset=".64" stopColor="#dad9d2" /><stop offset="1" stopColor="#b2b2ab" />
        </linearGradient>
        <linearGradient id={`${prefix}-hover`} x1="0" x2="1"><stop offset="0" stopColor="#e6f5a8"/><stop offset=".5" stopColor="#f4fbd6"/><stop offset="1" stopColor="#d8ec8f"/></linearGradient>
        <linearGradient id={`${prefix}-active`} x1="0" x2="1" y1=".1" y2=".8">
          <stop offset="0" stopColor="#1c1f1b" /><stop offset=".32" stopColor="#3a3e36" />
          <stop offset=".62" stopColor="#2b2e29" /><stop offset="1" stopColor="#1c1f1b" />
        </linearGradient>
        <radialGradient id={`${prefix}-face`} cx=".4" cy=".25" r=".8">
          <stop offset="0" stopColor="#f6f5f1" /><stop offset=".6" stopColor="#e2e1dc" /><stop offset="1" stopColor="#bdbdb6" />
        </radialGradient>
        <radialGradient id={`${prefix}-shadow`}><stop stopColor="#1c1f1b" stopOpacity=".15" /><stop offset="1" stopColor="#1c1f1b" stopOpacity="0" /></radialGradient>
        <clipPath id={`${prefix}-clip`}><path d={outline} /></clipPath>
      </defs>
      <g transform="translate(85 -5) scale(.75 .95)">
      <ellipse cx="180" cy="655" rx="79" ry="12" fill={url('shadow')} />
      <path d={outline} fill={url('body')} stroke="#b1b1aa" strokeWidth=".9" />
      <g opacity={nerve ? '.24' : '1'}>
        <path d="M180 30 C161 29 151 40 152 59 L155 79 Q162 99 180 105 Q198 99 205 79 L208 59 C209 40 199 29 180 30Z" fill={url('face')} stroke="#b9b9b2" strokeWidth=".6" />
        {!back ? <>
          {both(<>
            <path d="M156 60 Q164 54 175 59 L172 68 Q164 70 158 65Z" fill="#b8b8b1" opacity=".67" />
            <path d="M157 61 Q165 58 173 62 M159 64 L170 65" fill="none" stroke="#9a9a93" strokeWidth=".65" />
            <path d="M155 70 Q161 73 170 72 L171 80 L163 87 L158 80Z" fill="#d3d3cc" stroke="#bbbbb4" strokeWidth=".45" />
            <path d="M154 77 L159 87 L174 99 M158 78 L162 86 L175 96" fill="none" stroke="#aeb6a5" strokeWidth=".55" />
            <path d="M149 66 Q145 66 149 76 L153 79" fill="none" stroke="#a3a39c" strokeWidth=".8" />
          </>)}
          <path d="M177 60 L175 76 Q180 80 185 76 L183 60" fill={url('bone')} stroke="#aaaaa3" strokeWidth=".6" />
          <path d="M175 76 Q177 74 180 77 Q183 74 185 76 M172 87 Q180 84 188 87 M173 88 Q180 91 187 88" fill="none" stroke="#9f9f98" strokeWidth=".7" />
          <path d="M176 94 Q180 96 184 94" fill="none" stroke="#c2c2bb" />
        </> : <>
          <path d="M154 66 Q163 90 180 91 Q197 90 206 66 M158 80 Q161 97 173 101 M202 80 Q199 97 187 101" fill="none" stroke="#aeaea7" strokeWidth=".75" />
          <path d="M180 89 L180 109" fill="none" stroke="#bcbcb5" strokeWidth="1.8" />
        </>}
        {superficial && region('neck', back ? neckBack : neckFront)}
        {superficial && region('shoulder', shoulders)}
        {superficial && (back ? <>
          {region('upperBack', backMuscles)}
          {region('lowerBack', both(<path d="M124 237 L177 236 L177 337 L127 337Z" fill="transparent" />))}
        </> : region('chest', chest))}
        {superficial && region('arm', arms)}
        {superficial && region('forearm', both(<path d="M54 232 C75 234 94 253 91 280 L72 357 L50 357 L57 315Z" fill="transparent" />))}
        {superficial && region('abs', back ? waistBack : waistFront)}
        {superficial && region('hip', hips)}
        {superficial && region('thigh', thighs)}
        {superficial && region('calf', calves)}
        {deep && deepStructures}
        {!back && <path d="M178 138 L180 136 L182 138 L182 185 L180 190 L178 185Z" fill={url('bone')} stroke="#bbbeb0" strokeWidth=".5" />}
      </g>
      {nerve && <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M180 56 C168 51 162 57 164 66 C158 73 168 83 176 78 M180 56 C192 51 198 57 196 66 C202 73 192 83 184 78 M180 58 L180 103" stroke="#e09a1c" strokeWidth="1.5" />
        <path d="M171 58 L174 67 L169 73 M189 58 L186 67 L191 73 M175 76 L180 87 L185 76" stroke="#e8b04a" strokeWidth="1.1" />
        <path d="M180 91 L180 310" stroke="#f3d58a" strokeWidth="5" opacity=".52" />
        {nerveBranches.map(([id, d]) => region(id === 'back' ? 'upperBack' : id === 'arms' ? 'arm' : id === 'waist' ? 'abs' : id === 'hips' ? 'hip' : id, <>
          {both(<>
            <path d={d} stroke="transparent" strokeWidth="15" />
            <path d={d} stroke={activeFor(id === 'back' ? 'upperBack' : id === 'arms' ? 'arm' : id === 'waist' ? 'abs' : id === 'hips' ? 'hip' : id) ? '#ff7a1a' : '#dfa22e'} strokeWidth={activeFor(id === 'back' ? 'upperBack' : id === 'arms' ? 'arm' : id === 'waist' ? 'abs' : id === 'hips' ? 'hip' : id) ? '2.4' : '1.6'} />
            <path d={d} stroke="#ffe9a8" strokeWidth=".5" opacity=".65" />
          </>)}
        </>, `${LABELS[id]}相关神经`))}
        {Array.from({ length: 26 }, (_, i) => <path key={i} d={`M176 ${112 + i * 7} Q180 ${109 + i * 7} 184 ${112 + i * 7}`} stroke="#e0a020" strokeWidth=".85" />)}
      </g>}
      </g>
    </svg>
  );
}
