import {
    ExtensionContext
} from 'npm:@types/vscode@1.87.0';

import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
} from 'npm:vscode-languageclient@9.0.1/node';

let client: LanguageClient;

export function activate(_context: ExtensionContext) {

	// If the extension is launched in debug mode then the debug server options are used
	// Otherwise the run options are used
	const serverOptions: ServerOptions = {
		run: {command: "swipl",
              args: ["-g", "use_module(library(lsp_server)).",
               "-g", "lsp_server:main",
               "-t", "halt",
               "--", "stdio"]},
        debug: {command: "swipl",
          args: ["-g", "use_module(library(syslog)).",
                 "-g", "openlog(prolog_lsp, [], user).",
                 "-g", "use_module(library(debug)).",
                 "-g", "debug(server(high)).",
                 "-g", "use_module(library(lsp_server)).",
                 "-g", "lsp_server:main",
                 "-t", "halt",
                 "--", "stdio"]}
	};

	// Options to control the language client
	const clientOptions: LanguageClientOptions = {
		// Register the server for plain text documents
		documentSelector: [{ scheme: 'file', language: 'prolog' }],
	};

	// Create the language client and start the client.
	client = new LanguageClient(
		'prolog-lsp',
		'Prolog Language Client',
		serverOptions,
		clientOptions
	);

	// Start the client. This will also launch the server
	client.start();
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}