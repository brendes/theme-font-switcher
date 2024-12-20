import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    const outputChannel = vscode.window.createOutputChannel('Theme Font Switcher');
    const log = (message: string) => {
        const config = vscode.workspace.getConfiguration('themeFontSwitcher');
        if (config.get<boolean>('verbose', false)) {
            outputChannel.appendLine(message);
        }
    };

    const updateFontSettings = async () => {
        const config = vscode.workspace.getConfiguration('themeFontSwitcher');
        const currentTheme = vscode.window.activeColorTheme;
        const isDark = currentTheme.kind === vscode.ColorThemeKind.Dark;
        
        const lightFont = config.get<string>('lightThemeFont', 'monospace');
        const darkFont = config.get<string>('darkThemeFont', 'monospace');
        const lightFontSize = config.get<number>('lightThemeFontSize', 13);
        const darkFontSize = config.get<number>('darkThemeFontSize', 13);
        
        const newFont = isDark ? darkFont : lightFont;
        const newFontSize = isDark ? darkFontSize : lightFontSize;
        
        log(`Current theme type: ${isDark ? 'dark' : 'light'}`);
        log(`Selected font: ${newFont}`);
        log(`Selected font size: ${newFontSize}`);

        try {
            const editorConfig = vscode.workspace.getConfiguration('editor');
            
            try {
                await editorConfig.update('fontFamily', newFont, vscode.ConfigurationTarget.Global);
                log('Font family update successful');
            } catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                log(`Error updating font family: ${errorMessage}`);
            }
            
            try {
                await editorConfig.update('fontSize', newFontSize, vscode.ConfigurationTarget.Global);
                log('Font size update successful');
            } catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                log(`Error updating font size: ${errorMessage}`);
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            log(`Error in settings update: ${errorMessage}`);
        }
    };

    // Register event listeners and listen for changes
    context.subscriptions.push(
        vscode.window.onDidChangeActiveColorTheme(() => {
            log('\nTheme changed, updating font settings...');
            void updateFontSettings();
        }),
        
        vscode.workspace.onDidChangeConfiguration(event => {
            if (event.affectsConfiguration('themeFontSwitcher')) {
                log('\nConfiguration changed, updating font settings...');
                void updateFontSettings();
            }
        })
    );

    void updateFontSettings();
}

export function deactivate() {}