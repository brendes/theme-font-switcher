import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    const outputChannel = vscode.window.createOutputChannel('Theme Font Switcher');
    outputChannel.show();
    outputChannel.appendLine('Theme Font Switcher is now active!');

    const updateFontSettings = async () => {
        const config = vscode.workspace.getConfiguration('themeFontSwitcher');
        const currentTheme = vscode.window.activeColorTheme;
        const isDark = currentTheme.kind === vscode.ColorThemeKind.Dark;
        
        const lightFont = config.get<string>('lightThemeFont', 'monospace');
        const darkFont = config.get<string>('darkThemeFont', 'monospace');
        const lightFontSize = config.get<number>('lightThemeFontSize', 14);
        const darkFontSize = config.get<number>('darkThemeFontSize', 14);
        
        const newFont = isDark ? darkFont : lightFont;
        const newFontSize = isDark ? darkFontSize : lightFontSize;
        
        outputChannel.appendLine(`Current theme type: ${isDark ? 'dark' : 'light'}`);
        outputChannel.appendLine(`Selected font: ${newFont}`);
        outputChannel.appendLine(`Selected font size: ${newFontSize}`);

        try {
            const editorConfig = vscode.workspace.getConfiguration('editor');
            
            try {
                await editorConfig.update('fontFamily', newFont, vscode.ConfigurationTarget.Global);
                outputChannel.appendLine('Font family update successful');
            } catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                outputChannel.appendLine(`Error updating font family: ${errorMessage}`);
            }
            
            try {
                await editorConfig.update('fontSize', newFontSize, vscode.ConfigurationTarget.Global);
                outputChannel.appendLine('Font size update successful');
            } catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                outputChannel.appendLine(`Error updating font size: ${errorMessage}`);
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            outputChannel.appendLine(`Error in settings update: ${errorMessage}`);
        }
    };

    // Register event listeners and listen for changes
    context.subscriptions.push(
        vscode.window.onDidChangeActiveColorTheme(() => {
            outputChannel.appendLine('\nTheme changed, updating font settings...');
            void updateFontSettings();
        }),
        
        vscode.workspace.onDidChangeConfiguration(event => {
            if (event.affectsConfiguration('themeFontSwitcher')) {
                outputChannel.appendLine('\nConfiguration changed, updating font settings...');
                void updateFontSettings();
            }
        })
    );

    outputChannel.appendLine('\nInitializing font setup...');
    void updateFontSettings();
}

export function deactivate() {}