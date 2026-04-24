import { IFileTypes, IFiles, IPricingPlan } from '../interface/fileManager';

export const fileTypes: IFileTypes[] = [
  {
    name: 'Folders',
    total_files: 124,
    size: '45 MB',
    icon: 'folder-structure',
  },
  {
    name: 'Documents',
    total_files: 23,
    size: '34 MB',
    icon: 'doc-file',
  },
  {
    name: 'Images',
    total_files: 34,
    size: '78 MB',
    icon: 'image-file',
  },
  {
    name: 'PDF',
    total_files: 10,
    size: '56 MB',
    icon: 'pdf-file',
  },
  {
    name: 'XML',
    total_files: 18,
    size: '23 MB',
    icon: 'xml-file',
  },
  {
    name: 'SQL',
    total_files: 20,
    size: '45 MB',
    icon: 'sql-file',
  },
  {
    name: 'Audio',
    total_files: 23,
    size: '56 MB',
    icon: 'sql-file',
  },
  {
    name: 'Video',
    total_files: 2,
    size: '23 MB',
    icon: 'sql-file',
  },
];

export const pricingPlan: IPricingPlan[] = [
  {
    name: 'Trial Version',
    price: 'FREE',
    storage: '100 GB Space',
    status: 'Selected',
    image: 'assets/images/dashboard/folder.png',
  },
  {
    name: 'Premium',
    price: '$5/month',
    storage: '250 GB Space',
    status: 'Contact Us',
    image: 'assets/images/dashboard/folder1.png',
  },
];

export const files: IFiles[] = [
  {
    id: 1,
    name: 'Test folder',
    type: 'folder',
    children: [
      {
        id: 2,
        parent_id: 1,
        name: 'index.html',
        type: 'file',
        text: 'HTML',
      },
      {
        id: 29,
        parent_id: 1,
        name: 'Test Folder B',
        type: 'folder',
        children: [
          {
            id: 30,
            parent_id: 29,
            name: 'test.html',
            type: 'file',
            text: 'HTML',
          },
          {
            id: 31,
            parent_id: 29,
            name: 'Test Folder C',
            type: 'folder',
            children: [
              {
                id: 32,
                parent_id: 31,
                name: 'test.html',
                type: 'file',
                text: 'HTML',
              },
              {
                id: 33,
                parent_id: 31,
                name: 'Test Folder D',
                type: 'folder',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 3,
    name: 'index.html',
    type: 'file',
    text: 'HTML',
  },
  {
    id: 4,
    name: 'Folder A',
    type: 'folder',
  },
  {
    id: 5,
    name: 'index.php',
    type: 'file',
    text: 'PHP',
  },
  {
    id: 6,
    name: 'Textfile.txt',
    type: 'file',
    text: 'TXT',
  },
  {
    id: 7,
    name: 'Changelog.exe',
    type: 'file',
    text: '.?',
  },
  {
    id: 8,
    name: 'Folder B',
    type: 'folder',
  },
  {
    id: 9,
    name: 'Mofi.html',
    type: 'file',
    text: 'HTML',
  },
  {
    id: 10,
    name: 'Logo.psd',
    type: 'file',
    text: '.?',
  },
  {
    id: 11,
    name: 'Images',
    type: 'folder',
  },
  {
    id: 12,
    name: 'Applications',
    type: 'folder',
  },
  {
    id: 13,
    name: 'Project.zip',
    type: 'file',
    text: 'ZIP',
  },
  {
    id: 14,
    name: 'essay.txt',
    type: 'file',
    text: 'TXT',
  },
  {
    id: 15,
    name: 'Start-up',
    type: 'folder',
  },
  {
    id: 16,
    name: 'file.unknown',
    type: 'file',
    text: '.?',
  },
  {
    id: 17,
    name: 'timer.svg',
    type: 'file',
    text: 'SVG',
  },
  {
    id: 18,
    name: 'Resumes',
    type: 'folder',
  },
  {
    id: 19,
    name: 'Demo_files',
    type: 'folder',
  },
  {
    id: 20,
    name: '.net_pra',
    type: 'folder',
  },
  {
    id: 21,
    name: 'audiobook.m4b',
    type: 'file',
    text: '.?',
  },
  {
    id: 22,
    name: 'Portfolio',
    type: 'folder',
  },
  {
    id: 23,
    name: 'song.m4v',
    type: 'file',
    text: '.?',
  },
  {
    id: 24,
    name: 'product_list.xml',
    type: 'file',
    text: '.?',
  },
  {
    id: 25,
    name: 'birds_sound.aiff',
    type: 'file',
    text: '.?',
  },
  {
    id: 26,
    name: 'Themes',
    type: 'folder',
  },
  {
    id: 27,
    name: 'presentation.wmv',
    type: 'file',
    text: '.?',
  },
  {
    id: 28,
    name: 'conference.mp4',
    type: 'file',
    text: '.?',
  },
];

export const fileFormats: string[] = [
  // Documents
  '.pdf',
  '.doc',
  '.docx',
  '.xls',
  '.xlsx',
  '.ppt',
  '.pptx',
  '.txt',
  '.rtf',
  '.odt',

  // Code & Markup
  '.html',
  '.htm',
  '.css',
  '.js',
  '.ts',
  '.jsx',
  '.tsx',
  '.php',
  '.py',
  '.java',
  '.c',
  '.cpp',
  '.cs',
  '.json',
  '.xml',
  '.yaml',
  '.sql',
  '.sh',

  // Images
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.bmp',
  '.svg',
  '.webp',
  '.ico',
  '.tif',
  '.tiff',

  // Audio
  '.mp3',
  '.wav',
  '.aac',
  '.ogg',
  '.flac',
  '.m4a',

  // Video
  '.mp4',
  '.avi',
  '.mov',
  '.mkv',
  '.flv',
  '.wmv',
  '.webm',

  // Archives & Compressed
  '.zip',
  '.rar',
  '.7z',
  '.tar',
  '.gz',
  '.bz2',
  '.xz',
  '.iso',

  // Fonts
  '.ttf',
  '.otf',
  '.woff',
  '.woff2',

  // Executables & Scripts
  '.exe',
  '.msi',
  '.apk',
  '.bat',
  '.cmd',
  '.jar',
  '.bin',
  '.app',

  // Design & Media
  '.psd',
  '.ai',
  '.xd',
  '.sketch',
  '.fig',
  '.indd',
  '.blend',
];
